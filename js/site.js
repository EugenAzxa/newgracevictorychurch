/* ============================================================
   New Grace Victory Church - shared site behaviour
   Vanilla JS, no dependencies. Everything degrades without it.
   ============================================================ */

(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};

  /* --------------------------------------------------------
     1. Mobile navigation
     -------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
      document.body.style.overflow = !open ? 'hidden' : '';
    });

    // Close when a link is tapped, or on Escape
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
    // Re-opening at desktop width would leave the body locked
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });

    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  /* --------------------------------------------------------
     2. Header hairline once the page has scrolled
     -------------------------------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var stuck = false;
    var onScroll = function () {
      var should = window.scrollY > 8;
      if (should !== stuck) {
        stuck = should;
        header.classList.toggle('is-stuck', stuck);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------
     3. Reveal on scroll
        Without IntersectionObserver (or with reduced motion)
        everything is simply visible from the start.
     -------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reveals.length) {
    // nothing to do
  } else if (reduced || !('IntersectionObserver' in window)) {
    for (var i = 0; i < reveals.length; i++) reveals[i].classList.add('is-in');
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    reveals.forEach(function (el) { io.observe(el); });
  }

  /* --------------------------------------------------------
     4. Config -> page
        Elements carrying data-site="..." get their text (and
        href, where it makes sense) filled in from config.js.
        The HTML keeps a readable fallback so the page still
        makes sense with JS off.
     -------------------------------------------------------- */
  function fill(selector, value, href) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (value) el.textContent = value;
      if (href && el.tagName === 'A') el.setAttribute('href', href);
    });
  }

  if (cfg.email) {
    fill('[data-site="email"]', cfg.email, 'mailto:' + cfg.email);
  }
  if (cfg.phone) {
    fill('[data-site="phone"]', cfg.phone, cfg.phoneHref || null);
  }
  if (cfg.giving && cfg.giving.etransfer) {
    fill('[data-site="etransfer"]', cfg.giving.etransfer, null);
  }
  if (cfg.address && cfg.address.directions) {
    document.querySelectorAll('[data-site="directions"]').forEach(function (el) {
      el.setAttribute('href', cfg.address.directions);
    });
  }
  if (cfg.social) {
    Object.keys(cfg.social).forEach(function (key) {
      var url = cfg.social[key];
      document.querySelectorAll('[data-social="' + key + '"]').forEach(function (el) {
        if (url) el.setAttribute('href', url);
        else el.remove();
      });
    });
  }

  // Online giving link: show the card only if there is somewhere to send people
  var onlineGive = document.querySelector('[data-give="online"]');
  if (onlineGive) {
    var url = cfg.giving && cfg.giving.onlineUrl;
    if (url) {
      onlineGive.querySelectorAll('a[data-give-link]').forEach(function (a) {
        a.setAttribute('href', url);
      });
    } else {
      onlineGive.hidden = true;
    }
  }

  // Charitable registration number, for tax receipts
  var charity = document.querySelector('[data-give="charity"]');
  if (charity) {
    var num = cfg.giving && cfg.giving.charityNumber;
    if (num) charity.querySelector('[data-site="charity-number"]').textContent = num;
    else charity.hidden = true;
  }

  /* --------------------------------------------------------
     5. Current year in the footer
     -------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* --------------------------------------------------------
     6. Contact form
        Posts to Formspree when an ID is configured. Without
        one, the form is replaced by a plain mailto prompt
        rather than pretending to send.
     -------------------------------------------------------- */
  var form = document.querySelector('form[data-contact-form]');
  if (form) {
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type="submit"]');
    var fallback = document.querySelector('[data-form-fallback]');

    if (!cfg.formspreeId) {
      form.hidden = true;
      if (fallback) fallback.hidden = false;
    } else {
      form.setAttribute('action', 'https://formspree.io/f/' + cfg.formspreeId);

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Bots fill in every field they can find, including hidden ones
        if (form.querySelector('input[name="_gotcha"]').value) return;

        if (!form.reportValidity()) return;

        setStatus('', '');
        submit.disabled = true;
        var original = submit.textContent;
        submit.textContent = 'Sending...';

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Form endpoint returned ' + res.status);
            form.reset();
            setStatus(
              'Thank you - your message is on its way. Someone from the church will get back to you shortly.',
              'ok'
            );
          })
          .catch(function () {
            setStatus(
              'Sorry, that did not go through. Please email us directly at ' +
              (cfg.email || 'the address in the footer') + '.',
              'err'
            );
          })
          .then(function () {
            submit.disabled = false;
            submit.textContent = original;
          });
      });
    }

    function setStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status' + (kind ? ' form-status--' + kind : '');
      status.hidden = !message;
    }
  }
})();
