/* Local Edge - script.js (vanilla JS, no dependencies) */
(function () {
  'use strict';

  // Auto-update footer year
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('navMenu');
  function closeMenu() {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Scroll reveal (respects reduced motion)
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  // Contact form: validation + Formspree submit
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (form) {
    function setErr(name, msg) {
      var span = form.querySelector('.err[data-for="' + name + '"]');
      var input = form.elements[name];
      if (span) span.textContent = msg;
      if (input) input.classList.toggle('invalid', !!msg);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      var name = form.elements.name.value.trim();
      var phone = form.elements.phone.value.trim();
      var ok = true;

      setErr('name', ''); setErr('phone', '');
      if (name.length < 2) { setErr('name', 'Please enter your name.'); ok = false; }
      if (phone.replace(/\D/g, '').length < 7) { setErr('phone', 'Please enter a valid phone or WhatsApp number.'); ok = false; }
      if (!ok) return;

      // Honeypot: bots fill this in
      if (form.elements._gotcha.value) return;

      if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
        status.className = 'form-status bad';
        status.textContent = 'Form not connected yet. Please message me on WhatsApp instead.';
        return;
      }

      var submit = form.querySelector('button[type="submit"]');
      submit.disabled = true;
      status.textContent = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          status.className = 'form-status ok';
          status.textContent = 'Thank you! I got your message and will reply soon, usually the same day.';
        } else {
          throw new Error('Request failed');
        }
      }).catch(function () {
        status.className = 'form-status bad';
        status.textContent = 'Something went wrong. Please message me on WhatsApp: +263 78 487 1124.';
      }).finally(function () {
        submit.disabled = false;
      });
    });
  }
})();
