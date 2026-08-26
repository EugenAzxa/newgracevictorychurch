/* ============================================================
   Renders the sermon archive from data/sermons.json.

   That file is regenerated from the church's own YouTube feed by
   `node tools/update-sermons.mjs` - nothing here talks to YouTube
   directly, because their feed sends no CORS headers and would be
   blocked in the browser.
   ============================================================ */

(function () {
  'use strict';

  var mounts = document.querySelectorAll('[data-sermons]');
  var latestMount = document.querySelector('[data-sermon-latest]');
  if (!mounts.length && !latestMount) return;

  var PLAY_ICON =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M8 5.14v13.72a1 1 0 0 0 1.52.86l11.14-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14Z"/></svg>';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function card(sermon) {
    var speaker = sermon.speaker
      ? '<p class="sermon-meta">' + esc(sermon.speaker) + '</p>'
      : '<p class="sermon-meta">Watch on YouTube</p>';

    return (
      '<a class="sermon" href="' + esc(sermon.url) + '" target="_blank" rel="noopener"' +
      ' aria-label="Watch ' + esc(sermon.title) + ', ' + esc(sermon.dateLabel) + ', on YouTube">' +
        '<div class="sermon-thumb">' +
          '<img src="' + esc(sermon.thumb) + '" alt="" loading="lazy" width="480" height="270">' +
          '<div class="sermon-play"><span>' + PLAY_ICON + '</span></div>' +
        '</div>' +
        '<div class="sermon-body">' +
          '<p class="sermon-date">' + esc(sermon.dateLabel) + '</p>' +
          '<h3 class="sermon-title">' + esc(sermon.title) + '</h3>' +
          speaker +
        '</div>' +
      '</a>'
    );
  }

  /* A compact row, for use beside a large player */
  function row(sermon) {
    return (
      '<a class="sermon-row" href="' + esc(sermon.url) + '" target="_blank" rel="noopener">' +
        '<span class="sermon-row-mark">' + PLAY_ICON + '</span>' +
        '<span class="sermon-row-body">' +
          '<span class="sermon-date">' + esc(sermon.dateLabel) + '</span>' +
          '<h3 class="sermon-title">' + esc(sermon.title) + '</h3>' +
        '</span>' +
      '</a>'
    );
  }

  /* The newest service, embedded and ready to play.
     If there is nothing to show we leave whatever markup is already in the
     mount alone - on the Watch page that is a working playlist embed. */
  function renderLatest(mount, sermon) {
    if (!sermon) return;
    mount.innerHTML =
      '<div class="video-frame">' +
        '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(sermon.id) + '"' +
        ' title="' + esc(sermon.title) + ' - ' + esc(sermon.dateLabel) + '"' +
        ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
        ' referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>' +
      '</div>' +
      '<div class="featured-caption">' +
        '<h3>' + esc(sermon.title) + '</h3>' +
        '<p class="sermon-date">' + esc(sermon.dateLabel) + '</p>' +
      '</div>';
  }

  function render(mount, list) {
    var limit = parseInt(mount.getAttribute('data-limit'), 10);
    var skip = parseInt(mount.getAttribute('data-skip'), 10) || 0;
    var style = mount.getAttribute('data-sermons') === 'list' ? row : card;

    var items = list.slice(skip);
    if (limit > 0) items = items.slice(0, limit);

    if (!items.length) {
      mount.innerHTML =
        '<p class="lede">Nothing here yet - head over to ' +
        '<a class="link-arrow" href="https://www.youtube.com/@NewGraceVictoryChurch" ' +
        'target="_blank" rel="noopener">the YouTube channel</a>.</p>';
      return;
    }

    mount.innerHTML = items.map(style).join('');
  }

  fetch('data/sermons.json', { cache: 'no-cache' })
    .then(function (res) {
      if (!res.ok) throw new Error('sermons.json returned ' + res.status);
      return res.json();
    })
    .then(function (data) {
      // Newest first, across both the live feed and the hand-kept archive
      var all = (data.sermons || []).concat(data.archive || []);
      all.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });

      if (latestMount) renderLatest(latestMount, all[0]);
      mounts.forEach(function (mount) { render(mount, all); });

      // Stamp the "last updated" line, if the page has one
      document.querySelectorAll('[data-sermons-updated]').forEach(function (el) {
        if (data.updated) el.textContent = data.updated;
      });
    })
    .catch(function (err) {
      // Never leave an empty box - always give people a way through to YouTube
      mounts.forEach(function (mount) {
        mount.innerHTML =
          '<p class="lede">We could not load the message archive just now. ' +
          'You can watch every service on ' +
          '<a class="link-arrow" href="https://www.youtube.com/@NewGraceVictoryChurch" ' +
          'target="_blank" rel="noopener">our YouTube channel</a>.</p>';
      });
      if (window.console) console.warn('[sermons]', err.message);
    });
})();
