/* ============================================================
   The Saylavy app mockup — tab switching.

   Built as a real tablist so it is keyboard operable: arrow keys
   move between tabs, Home/End jump to the ends. Without JS the
   first screen simply stays on show, which is still a fair
   picture of the app.
   ============================================================ */

(function () {
  'use strict';

  document.querySelectorAll('[data-phone]').forEach(function (phone) {
    var tabs = Array.prototype.slice.call(phone.querySelectorAll('.phone-tab'));
    var screens = Array.prototype.slice.call(phone.querySelectorAll('.phone-screen'));
    if (!tabs.length || !screens.length) return;

    function select(index, focus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.setAttribute('tabindex', on ? '0' : '-1');
      });
      screens.forEach(function (screen, i) {
        screen.classList.toggle('is-active', i === index);
        // Keep hidden screens out of the accessibility tree and tab order
        screen.setAttribute('aria-hidden', String(i !== index));
      });
      if (focus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });

      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        select(next, true);
      });
    });

    select(0);

    /* The voice-note waveform. Drawn here rather than in the markup so
       the HTML is not 40 empty <i> tags, and so every phone on the page
       gets a slightly different shape. */
    phone.querySelectorAll('.ph-wave').forEach(function (wave, w) {
      var bars = 26;
      var html = '';
      for (var i = 0; i < bars; i++) {
        // A steady, speech-like shape - deterministic, so it never
        // re-renders differently between visits
        var t = (i + w * 3) / bars;
        var h = 4 + Math.round(Math.abs(Math.sin(t * 7.2)) * 9 + Math.abs(Math.sin(t * 2.1)) * 6);
        html += '<i style="height:' + h + 'px"></i>';
      }
      wave.innerHTML = html;
    });
  });
})();
