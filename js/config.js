/* ============================================================
   NEW GRACE VICTORY CHURCH - SITE CONFIG
   ------------------------------------------------------------
   This is the ONLY file you need to edit to change the church's
   contact details, giving info and social links. Change a value
   here and it updates everywhere on every page.

   Anything marked TODO is a placeholder - the real value wasn't
   published anywhere public, so it needs to come from the church.
   ============================================================ */

window.SITE_CONFIG = {

  /* --- contact -------------------------------------------- */
  // TODO: replace with the church's real address
  email: 'hello@newgracevictorychurch.ca',

  // TODO: replace with the church's real number, digits only in `tel`
  phone: '+1 (416) 000-0000',
  phoneHref: 'tel:+14160000000',

  /* --- where they meet ------------------------------------ */
  address: {
    line1: '465 Norfinch Dr, Unit 2',
    line2: 'North York, ON  M3N 1Y7',
    city: 'Toronto',
    region: 'ON',
    postal: 'M3N 1Y7',
    country: 'CA',
    // Opens the address in whatever maps app the visitor uses
    directions: 'https://www.google.com/maps/search/?api=1&query=465+Norfinch+Dr+Unit+2,+North+York,+ON+M3N+1Y7',
  },

  /* --- giving --------------------------------------------- */
  giving: {
    // TODO: the e-Transfer address giving should be sent to
    etransfer: 'giving@newgracevictorychurch.ca',
    // TODO: online giving link (Tithe.ly / Givelify / Stripe / PayPal).
    // Leave as null and the online-giving card hides itself.
    onlineUrl: null,
    // TODO: CRA charitable registration number, for tax receipts.
    // Leave as null and the receipt note hides itself.
    charityNumber: null,
  },

  /* --- contact form --------------------------------------- */
  // TODO: create a free form endpoint at https://formspree.io and paste the
  // ID here (it looks like 'xnqkzabc'). Until then the form tells visitors
  // to email instead of silently failing.
  formspreeId: null,

  /* --- social ---------------------------------------------- */
  social: {
    youtube:   'https://www.youtube.com/@NewGraceVictoryChurch',
    instagram: 'https://www.instagram.com/newgracevictorychurch/',
    facebook:  'https://www.facebook.com/NewGraceVictoryChurch/',
    tiktok:    'https://www.tiktok.com/@newgracevictorychurch',
  },

  /* --- the church's own YouTube channel -------------------- */
  youtubeChannelId: 'UCJITgKagD4qcF2JU9xZJblw',
};
