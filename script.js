/* Local Edge - script.js (vanilla JS, no dependencies)
   1. Footer year   2. Mobile drawer   3. Scrollspy   4. Scroll reveal
   5. Journal modals   6. Contact form (validation + Formspree)            */
(function () {
  'use strict';

  var body = document.body;
  var mqMobile = window.matchMedia('(max-width: 959px)');

  /* ---------- 1. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 2. Mobile drawer ---------- */
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('navPanel');
  var backdrop = document.getElementById('navBackdrop');

  function setNav(open) {
    body.classList.toggle('nav-open', open);
    body.classList.toggle('lock', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    backdrop.hidden = !open;
  }

  if (toggle && panel && backdrop) {
    toggle.addEventListener('click', function () {
      var open = !body.classList.contains('nav-open');
      setNav(open);
      if (open) {
        var first = panel.querySelector('a');
        if (first) first.focus();
      }
    });
    backdrop.addEventListener('click', function () { setNav(false); toggle.focus(); });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!body.classList.contains('nav-open')) return;
      if (e.key === 'Escape') { setNav(false); toggle.focus(); return; }
      if (e.key === 'Tab') {
        // Keep keyboard focus inside the open drawer
        var items = [toggle].concat([].slice.call(panel.querySelectorAll('a, button')));
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });
    var onBreakpoint = function () { if (!mqMobile.matches) setNav(false); };
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBreakpoint);
    else if (mqMobile.addListener) mqMobile.addListener(onBreakpoint);
  }

  /* ---------- 3. Scrollspy (highlights the section in view) ---------- */
  var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if ('IntersectionObserver' in window && links.length) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var link = map[entry.target.id];
        if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) spy.observe(sec);
    });
    // Clear the highlight when back in the hero
    var hero = document.querySelector('.hero');
    if (hero) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
  }

  /* ---------- 4. Scroll reveal (respects reduced motion) ---------- */
  var reveals = [].slice.call(document.querySelectorAll('.reveal'));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Journal modals (native <dialog>) ---------- */
  var lastTrigger = null;

  function openModal(id, trigger) {
    var dlg = document.getElementById(id);
    if (!dlg) return;
    lastTrigger = trigger || null;
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    body.classList.add('lock');
    dlg.scrollTop = 0;
  }

  function closeModal(dlg) {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
    afterClose();
  }

  function afterClose() {
    if (!document.querySelector('dialog[open]') && !body.classList.contains('nav-open')) body.classList.remove('lock');
  }

  document.querySelectorAll('[data-open]').forEach(function (btn) {
    btn.addEventListener('click', function () { openModal(btn.getAttribute('data-open'), btn); });
  });

  document.querySelectorAll('dialog.modal').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) { closeModal(dlg); return; }              // click on the backdrop
      var closer = e.target.closest ? e.target.closest('[data-close]') : null;
      if (closer) closeModal(dlg);                                    // close button or in-article link
    });
    dlg.addEventListener('close', function () {
      afterClose();
      if (lastTrigger && lastTrigger.focus && !(document.activeElement && document.activeElement !== document.body)) lastTrigger.focus();
    });
  });

  /* ---------- 6. Contact form ---------- */
  var form = document.getElementById('contactForm');
  var statusEl = document.getElementById('formStatus');

  if (form) {
    var fields = {
      name: function (v) { return v.length >= 2 ? '' : 'Please enter your name.'; },
      business: function (v) { return v.length >= 2 ? '' : 'Please enter your business name.'; },
      contact: function (v) {
        var email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        var phone = v.replace(/\D/g, '').length >= 7 && /^[+\d\s()\-]+$/.test(v);
        return (email || phone) ? '' : 'Enter a phone or WhatsApp number, or an email address.';
      },
      business_type: function (v) { return v ? '' : 'Please choose your business type.'; },
      goal: function (v) { return v ? '' : 'Please choose what you would like to improve.'; },
      website: function (v) {
        if (!v) return '';
        var candidate = /^https?:\/\//i.test(v) ? v : 'https://' + v;
        try {
          var u = new URL(candidate);
          return (u.hostname.indexOf('.') > 0 && !/\s/.test(v)) ? '' : 'That does not look like a web address.';
        } catch (err) { return 'That does not look like a web address.'; }
      }
    };

    var setError = function (name, msg) {
      var input = form.elements[name];
      var span = form.querySelector('.err[data-for="' + name + '"]');
      if (span) span.textContent = msg;
      if (input) {
        if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      }
    };

    var validateField = function (name) {
      var input = form.elements[name];
      var msg = fields[name]((input.value || '').trim());
      setError(name, msg);
      return !msg;
    };

    Object.keys(fields).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener('blur', function () { if ((input.value || '').trim() || input.getAttribute('aria-invalid')) validateField(name); });
      input.addEventListener('input', function () { if (input.getAttribute('aria-invalid')) validateField(name); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.className = 'form-status';
      statusEl.textContent = '';

      var firstBad = null;
      Object.keys(fields).forEach(function (name) {
        if (!validateField(name) && !firstBad) firstBad = form.elements[name];
      });
      if (firstBad) {
        firstBad.focus();
        statusEl.className = 'form-status bad';
        statusEl.textContent = 'Please fix the highlighted fields and try again.';
        return;
      }

      // Honeypot: bots fill this in
      if (form.elements._gotcha && form.elements._gotcha.value) return;

      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        statusEl.className = 'form-status bad';
        statusEl.textContent = 'The form is not connected yet. Please use the WhatsApp button instead.';
        return;
      }

      var data = new FormData(form);
      var site = (form.elements.website.value || '').trim();
      if (site && !/^https?:\/\//i.test(site)) data.set('website', 'https://' + site);

      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      statusEl.textContent = 'Sending...';

      fetch(form.action, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          Object.keys(fields).forEach(function (n) { setError(n, ''); });
          statusEl.className = 'form-status ok';
          statusEl.textContent = 'Thank you. I have your request and will reply soon, usually the same day.';
        })
        .catch(function () {
          statusEl.className = 'form-status bad';
          statusEl.textContent = 'Something went wrong. Please message me on WhatsApp: +263 78 487 1124.';
        })
        .then(function () { submit.disabled = false; });
    });
  }
})();
