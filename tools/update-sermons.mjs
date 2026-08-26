/**
 * update-sermons.mjs
 * -----------------------------------------------------------
 * Pulls the latest uploads + livestreams from the church's own
 * YouTube channel feed and rewrites ../data/sermons.json.
 *
 * The channel titles every livestream identically ("Online Church
 * Service | Uplifting Worship & Powerful Message"), which is useless
 * on a website. So we relabel each one from the day it was streamed
 * ("Sunday Service - 28 June 2026") and let anyone override a title
 * by hand in data/overrides.json.
 *
 * Usage:  node tools/update-sermons.mjs
 * Needs:  Node 18+ (global fetch). No dependencies.
 */

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

const CHANNEL_ID = 'UCJITgKagD4qcF2JU9xZJblw';
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * The church is in Toronto. A service streamed Sunday 9pm ET is stamped
 * Monday in UTC, so every part of the date - weekday, label AND the sortable
 * iso - has to come from the same America/Toronto reading. Mixing a local
 * weekday with a UTC date is how you end up with "Sunday, 11 May".
 */
function torontoParts(input) {
  const d = new Date(input);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Toronto',
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }).formatToParts(d).map(p => [p.type, p.value])
  );
  const monthIndex = MONTHS.indexOf(parts.month);
  const iso = [
    parts.year,
    String(monthIndex + 1).padStart(2, '0'),
    String(parts.day).padStart(2, '0'),
  ].join('-');

  return {
    weekday: parts.weekday,
    label: `${Number(parts.day)} ${parts.month} ${parts.year}`,
    iso,
  };
}

/**
 * The church gathers Sundays, Wednesdays and Fridays. Anything streamed on
 * another day is usually a test or an extra meeting - call it a service
 * rather than inventing a "Tuesday Gathering" that nobody runs.
 */
function autoTitle(weekday) {
  if (weekday === 'Sunday') return 'Sunday Service';
  if (weekday === 'Wednesday' || weekday === 'Friday') return 'Midweek Service';
  return 'Church Service';
}

function decode(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** A generic auto-generated livestream title carries no information. */
function isGeneric(title) {
  return /Online Church Service|Uplifting Worship|^@NewGraceVictoryChurch/i.test(title);
}

async function main() {
  const res = await fetch(FEED);
  if (!res.ok) throw new Error(`Feed request failed: ${res.status} ${res.statusText}`);
  const xml = await res.text();

  let overrides = {};
  try {
    overrides = JSON.parse(await readFile(join(ROOT, 'data', 'overrides.json'), 'utf8'));
  } catch {
    // no overrides file yet - fine
  }

  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]);

  const parsed = entries.map(e => {
    const id = (e.match(/<yt:videoId>([^<]+)</) || [])[1];
    const rawTitle = decode((e.match(/<title>([^<]+)</) || [])[1] || '');
    const published = (e.match(/<published>([^<]+)</) || [])[1];
    const { weekday, label, iso } = torontoParts(published);
    const override = overrides[id] || {};

    return {
      id,
      title: override.title || (isGeneric(rawTitle) ? autoTitle(weekday) : rawTitle),
      speaker: override.speaker || null,
      weekday,
      date: iso,
      dateLabel: label,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      url: `https://www.youtube.com/watch?v=${id}`,
    };
  }).filter(s => s.id);

  /*
   * A dropped connection mid-service means the same Sunday shows up two or
   * three times in the feed. Keep the first (most recent) per calendar day so
   * the archive reads like a list of services, not a list of stream attempts.
   */
  const byDate = new Map();
  const duplicates = [];
  for (const s of parsed) {
    if (byDate.has(s.date)) duplicates.push(s);
    else byDate.set(s.date, s);
  }
  const sermons = [...byDate.values()];
  if (duplicates.length) {
    console.log(`Collapsed ${duplicates.length} same-day restream(s): ${duplicates.map(d => d.date).join(', ')}`);
  }

  // Keep the hand-curated archive entries that have fallen off the 15-item feed.
  let existing = { archive: [] };
  try {
    existing = JSON.parse(await readFile(join(ROOT, 'data', 'sermons.json'), 'utf8'));
  } catch { /* first run */ }

  const seen = new Set(sermons.map(s => s.id));
  const archive = (existing.archive || []).filter(s => !seen.has(s.id));

  const out = {
    channelId: CHANNEL_ID,
    channelUrl: 'https://www.youtube.com/@NewGraceVictoryChurch',
    liveEmbed: `https://www.youtube.com/embed/live_stream?channel=${CHANNEL_ID}`,
    updated: new Date().toISOString().slice(0, 10),
    featured: existing.featured || null,
    sermons,
    archive,
  };

  await writeFile(join(ROOT, 'data', 'sermons.json'), JSON.stringify(out, null, 2) + '\n');
  console.log(`Wrote ${sermons.length} sermons + ${archive.length} archived. Updated ${out.updated}.`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
