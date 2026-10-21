/* Local Edge - script.js (vanilla JavaScript, no dependencies)
   Everything here is a progressive enhancement: the pages remain readable and the links keep working without it.
   Sections: 1 Basics  2 Config-driven content  3 Filters  4 Service-fit finder  5 Forms
             6 Reading tools  7 Misc enhancements                                              */
(function () {
  'use strict';

  var C = window.LE_CONFIG || {};
  var body = document.body;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return [].slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var money = function (n) { return '$' + n; };

  /* ================= 1. BASICS ================= */

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---- Mobile drawer ----
  var toggle = document.getElementById('navToggle');
  var panel = document.getElementById('navPanel');
  var backdrop = document.getElementById('navBackdrop');
  var mqMobile = window.matchMedia('(max-width: 959px)');

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
      if (open) { var first = $('a', panel); if (first) first.focus(); }
    });
    backdrop.addEventListener('click', function () { setNav(false); toggle.focus(); });
    $$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!body.classList.contains('nav-open')) return;
      if (e.key === 'Escape') { setNav(false); toggle.focus(); return; }
      if (e.key === 'Tab') {
        var items = [toggle].concat($$('a, button', panel));
        var firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    });
    var onBp = function () { if (!mqMobile.matches) setNav(false); };
    if (mqMobile.addEventListener) mqMobile.addEventListener('change', onBp); else if (mqMobile.addListener) mqMobile.addListener(onBp);
  }

  // ---- Scroll reveal ----
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    body.classList.add('reveal-ready');
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { rio.observe(el); });
  }

  // ---- On-page jump links: highlight the section in view ----
  $$('.jump').forEach(function (list) {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('a[href^="#"]', list), map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var l = map[en.target.id]; if (l) { l.classList.add('active'); l.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  });

  // ---- Floating WhatsApp button: step aside near forms and the footer ----
  var wa = $('[data-wa-float]');
  if (wa && 'IntersectionObserver' in window) {
    var touching = [];
    var wio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var i = touching.indexOf(en.target);
        if (en.isIntersecting && i < 0) touching.push(en.target);
        if (!en.isIntersecting && i >= 0) touching.splice(i, 1);
      });
      wa.classList.toggle('is-away', touching.length > 0);
    }, { threshold: 0 });
    $$('form[data-form], .site-footer, [data-hide-wa]').forEach(function (el) { wio.observe(el); });
  }

  /* ================= 2. CONFIG-DRIVEN CONTENT ================= */

  // Prices and payment split (the HTML already contains the same figures for no-JavaScript visitors)
  $$('[data-price]').forEach(function (el) {
    var v = C.prices && C.prices[el.getAttribute('data-price')];
    if (typeof v === 'number') el.textContent = money(v);
  });
  $$('[data-retainer]').forEach(function (el) {
    var v = C.retainers && C.retainers[el.getAttribute('data-retainer')];
    if (typeof v === 'number') el.textContent = money(v);
  });
  $$('[data-pay]').forEach(function (el) {
    var v = C.payment && C.payment[el.getAttribute('data-pay')];
    if (typeof v === 'number') el.textContent = String(v);
  });

  // Optional introductory offer (off unless site-config.js turns it on)
  var offerEl = $('[data-intro-offer]');
  var offer = C.introOffer;
  if (offerEl && offer && offer.active && C.prices && typeof C.prices[offer.package] === 'number' && offer.discount > 0) {
    var std = C.prices[offer.package], result = std - offer.discount;
    if (result > 0) {
      var nm = (C.packageNames && C.packageNames[offer.package]) || offer.package;
      var mk = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };
      offerEl.textContent = '';
      offerEl.appendChild(mk('p', 'io-label', offer.label || 'Introductory offer'));
      offerEl.appendChild(mk('h3', '', nm));
      var rows = mk('dl', 'io-rows', '');
      [['Standard starting price', money(std)], ['Introductory discount', '−' + money(offer.discount)], ['Price for this agreed scope', money(result)]].forEach(function (r, i) {
        var d = mk('div', i === 2 ? 'io-total' : '', '');
        d.appendChild(mk('dt', '', r[0])); d.appendChild(mk('dd', '', r[1])); rows.appendChild(d);
      });
      offerEl.appendChild(rows);
      if (offer.note) offerEl.appendChild(mk('p', 'fine', offer.note));
      offerEl.hidden = false;
    }
  }

  // Approved reviews only. Empty by default, so the honest empty state stays visible.
  var reviewList = document.getElementById('reviewList');
  var reviewEmpty = document.getElementById('reviewEmpty');
  if (reviewList && C.reviews && C.reviews.length) {
    var approved = C.reviews.filter(function (r) { return r && r.permission === 'approved' && r.quote && r.attribution; });
    if (approved.length) {
      approved.forEach(function (r) {
        var fig = document.createElement('figure'); fig.className = 'review';
        var bq = document.createElement('blockquote'); var p = document.createElement('p'); p.textContent = r.quote; bq.appendChild(p);
        var cap = document.createElement('figcaption');
        cap.textContent = [r.attribution, r.service, r.date].filter(Boolean).join(' · ');
        fig.appendChild(bq); fig.appendChild(cap); reviewList.appendChild(fig);
      });
      reviewList.hidden = false;
      if (reviewEmpty) reviewEmpty.hidden = true;
    }
  }

  // Show the right "how your details are handled" statement for each form
  $$('form[data-form]').forEach(function (form) {
    var connected = !!(C.forms && C.forms[form.getAttribute('data-form')]);
    var scope = form.closest('.form-layout') || document;
    $$('[data-when]', scope).forEach(function (el) {
      var when = el.getAttribute('data-when');
      // a block belongs to the first form in its layout
      el.hidden = (when === 'connected') ? !connected : connected;
    });
  });

  /* ================= 3. FILTERS (work and insights) ================= */

  $$('[data-filter-group]').forEach(function (group) {
    var scope = group.parentElement;
    var itemsWrap = $('[data-filter-items]', scope);
    if (!itemsWrap) return;
    var items = [].slice.call(itemsWrap.children).filter(function (el) { return el.hasAttribute('data-cat'); });
    var status = $('[data-filter-status]', scope);
    var empty = $('[data-filter-empty]', scope);
    var emptyMsg = empty ? $('[data-filter-empty-msg]', empty) : null;
    var defaultMsg = emptyMsg ? emptyMsg.textContent : '';
    var buttons = $$('[data-filter]', group);

    function apply(btn) {
      var f = btn.getAttribute('data-filter');
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var shown = 0;
      items.forEach(function (it) {
        var match = f === 'all' || it.getAttribute('data-cat').split(/\s+/).indexOf(f) !== -1;
        it.hidden = !match;
        if (match) shown++;
      });
      if (empty) {
        empty.hidden = shown !== 0;
        if (emptyMsg) emptyMsg.textContent = btn.getAttribute('data-empty-msg') || defaultMsg;
      }
      if (status) {
        var label = btn.textContent.trim();
        status.textContent = f === 'all' ? 'Showing all ' + shown + (shown === 1 ? ' item' : ' items') :
          (shown === 0 ? 'No items for “' + label + '”.' : 'Showing ' + shown + (shown === 1 ? ' item' : ' items') + ' for “' + label + '”.');
      }
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { apply(b); }); });
  });

  /* ================= 4. SERVICE-FIT FINDER ================= */

  var finder = $('[data-finder]');
  if (finder) {
    var resultEl = $('[data-finder-result]');
    var errEl = $('[data-finder-err]');
    var careFs = $('[data-show-if="need=ongoing"]', finder);
    var val = function (name) { var c = $('input[name="' + name + '"]:checked', finder); return c ? c.value : ''; };
    var price = function (k) { return C.prices && typeof C.prices[k] === 'number' ? money(C.prices[k]) : ''; };
    var retainer = function (k) { return C.retainers && typeof C.retainers[k] === 'number' ? money(C.retainers[k]) + '/month' : ''; };

    var syncCare = function () { if (careFs) careFs.hidden = val('need') !== 'ongoing'; };
    finder.addEventListener('change', syncCare);
    finder.addEventListener('reset', function () {
      setTimeout(function () { syncCare(); resultEl.hidden = true; resultEl.textContent = ''; errEl.textContent = ''; }, 0);
    });

    var recommend = function (a) {
      var r = { notes: [] };
      if (a.need === 'ongoing') {
        var lvl = a.care || 'care';
        var names = { care: 'Website Care', growth: 'Website Growth', partner: 'Digital Partner' };
        var why = {
          care: 'You want a few small edits and routine checks. This plan covers up to 30 minutes of edits a month and a monthly check of key links and contact paths.',
          growth: 'You want regular updates and ongoing improvement. This plan adds up to 90 minutes a month, one prioritised improvement idea and a monthly check-in or summary.',
          partner: 'You want a more active continuing relationship. This plan includes up to three hours a month, monthly prioritisation and a review of your enquiry paths.'
        };
        r.key = lvl; r.title = names[lvl]; r.price = retainer(lvl); r.why = why[lvl]; r.service = 'care'; r.plan = lvl; r.anchor = '#care';
        if (a.site === 'none') r.notes.push('Care plans look after an existing website. If you do not have one yet, a website package comes first.');
        return r;
      }
      if (a.need === 'unsure') {
        r.key = 'unsure'; r.title = 'Start with a free demo request or a short conversation'; r.price = '';
        r.why = 'When it is not yet clear what you need, the most useful first step is to describe your business and the main problem. Nothing is decided until a written scope and price are agreed.';
        r.service = 'unsure'; r.anchor = '#packages'; return r;
      }
      if (a.path === 'system') {
        r.key = 'advanced'; r.title = 'Advanced Website'; r.price = 'from ' + price('advanced');
        r.why = 'You mentioned booking, payments or live availability. These need a separate feasibility assessment and quotation, and they are not part of the standard packages. An Advanced project is scoped once we know what is feasible and what it would involve.';
        r.service = 'new'; r.anchor = '#advanced'; r.pkg = 'advanced';
        if (a.type === 'hosp') r.notes.push('If a simple booking-request pathway through WhatsApp would be enough to start with, the Hospitality Website may fit instead.');
        return r;
      }
      if (a.type === 'hosp') {
        if (a.path === 'compare') {
          r.key = 'hospitality'; r.title = 'Hospitality Website'; r.price = 'from ' + price('hospitality');
          r.why = 'You want guests to compare rooms, experiences or packages and send an enquiry or booking request. The Hospitality Website covers a gallery, accommodation or experiences, visitor information and a clear WhatsApp enquiry path.';
          r.service = 'hospitality'; r.anchor = '#hospitality'; r.pkg = 'hospitality';
        } else {
          r.key = 'starter'; r.title = 'Starter Website'; r.price = 'from ' + price('starter');
          r.why = 'You mainly need visitors to find information and contact you. A Starter Website gives you one clear page with a WhatsApp or other contact link.';
          r.service = a.need === 'refresh' ? 'improve' : 'new'; r.anchor = '#starter'; r.pkg = 'starter';
          r.notes.push('If you would like a gallery, rooms or experiences and visitor information, the Hospitality Website (from ' + price('hospitality') + ') fits better.');
        }
      } else if (a.path === 'compare') {
        r.key = 'business'; r.title = 'Business Website'; r.price = 'from ' + price('business');
        r.why = 'You want visitors to explore several services or options before they enquire. A Business Website gives you up to five agreed pages and clear enquiry pathways.';
        r.service = a.need === 'refresh' ? 'improve' : 'new'; r.anchor = '#business'; r.pkg = 'business';
        r.notes.push('If you also need search, filtering or integrations, an Advanced Website may be needed. Scope is agreed before work begins.');
      } else if (a.need === 'first' && a.site === 'none') {
        r.key = 'starter'; r.title = 'Starter Website'; r.price = 'from ' + price('starter');
        r.why = 'You need a clear, professional starting point online. A Starter Website gives you one responsive page with up to five sections and a WhatsApp or other contact link.';
        r.service = 'new'; r.anchor = '#starter'; r.pkg = 'starter';
        r.notes.push('If you would like several pages, the Business Website (from ' + price('business') + ') is the next step up.');
      } else {
        r.key = 'business'; r.title = 'Business Website'; r.price = 'from ' + price('business');
        r.why = 'You have a site that could work harder, or you want more complete information. A Business Website covers up to five agreed pages with a customised layout and clearer enquiry pathways.';
        r.service = a.need === 'refresh' ? 'improve' : 'new'; r.anchor = '#business'; r.pkg = 'business';
      }
      if (a.need === 'refresh' || a.site === 'weak') r.notes.push('Improving an existing site starts with a short review of what is there. The scope and price are agreed in writing before any paid work.');
      return r;
    };

    finder.addEventListener('submit', function (e) {
      e.preventDefault();
      var a = { site: val('site'), need: val('need'), type: val('type'), path: val('path'), care: val('care') };
      var missing = !a.site || !a.need;
      if (!missing && a.need !== 'ongoing' && a.need !== 'unsure' && (!a.type || !a.path)) missing = true;
      if (missing) {
        errEl.textContent = 'Please answer each question above so I can give a useful guide.';
        resultEl.hidden = true; return;
      }
      errEl.textContent = '';
      var r = recommend(a);
      resultEl.textContent = '';
      var mk = function (tag, cls, text) { var el = document.createElement(tag); if (cls) el.className = cls; if (text) el.textContent = text; return el; };
      resultEl.appendChild(mk('p', 'rk', 'Your initial guide'));
      var h = mk('h3', 'rv', r.title);
      if (r.price) { var sp = mk('span', '', r.price); h.appendChild(sp); }
      resultEl.appendChild(h);
      resultEl.appendChild(mk('p', '', r.why));
      r.notes.forEach(function (n) { resultEl.appendChild(mk('p', 'rn', n)); });
      resultEl.appendChild(mk('p', 'fine', 'This is an initial guide, not a quotation. The final scope and price are agreed in writing before work begins.'));
      var actions = mk('div', 'result-actions', '');
      var q = 'service=' + encodeURIComponent(r.service) + '&from=finder&suggested=' + encodeURIComponent(r.title + (r.price ? ' (' + r.price + ')' : ''));
      if (r.plan) q += '&plan=' + encodeURIComponent(r.plan);
      var a1 = mk('a', 'btn btn-gold', 'Send a project enquiry'); a1.href = 'contact.html?' + q + '#enquiry';
      var a2 = mk('a', 'btn btn-outline-navy', 'Request a Free Demo'); a2.href = 'demo.html';
      var a3 = mk('a', 'btn btn-outline-navy', 'See what is included'); a3.href = r.anchor;
      actions.appendChild(a1); actions.appendChild(a2); actions.appendChild(a3);
      resultEl.appendChild(actions);
      resultEl.hidden = false;
      resultEl.focus({ preventScroll: true });
      resultEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  /* ================= 5. FORMS ================= */

  function initForm(form) {
    var type = form.getAttribute('data-form');
    var endpoint = (C.forms && C.forms[type]) || '';
    var statusEl = $('[data-form-status]', form);
    var contact = C.contact || {};
    var rules = {
      contact: function (v) {
        var email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
        var phone = v.replace(/\D/g, '').length >= 7 && /^[+\d\s()\-]+$/.test(v);
        return email || phone;
      },
      url: function (v) {
        if (/\s/.test(v)) return false;
        try { var u = new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v); return u.hostname.indexOf('.') > 0; } catch (e) { return false; }
      }
    };

    // group controls by name
    var groups = {};
    $$('input, select, textarea', form).forEach(function (el) {
      if (!el.name || el.name.charAt(0) === '_' || el.type === 'hidden' || el.type === 'submit') return;
      (groups[el.name] = groups[el.name] || []).push(el);
    });

    var valueOf = function (list) {
      var f = list[0];
      if (f.type === 'radio') { var c = list.filter(function (x) { return x.checked; })[0]; return c ? c.value : ''; }
      if (f.type === 'checkbox') return f.checked ? f.value : '';
      return (f.value || '').trim();
    };
    var errFor = function (list) { var f = list[0].closest('.field'); return f ? $('.err', f) : null; };
    var msgFor = function (list, err) {
      for (var i = 0; i < list.length; i++) if (list[i].getAttribute('data-msg')) return list[i].getAttribute('data-msg');
      return (err && err.getAttribute('data-msg')) || 'Please complete this field.';
    };

    var check = function (name) {
      var list = groups[name];
      var v = valueOf(list);
      var required = list.some(function (x) { return x.required; });
      var rule = list[0].getAttribute('data-rule');
      var bad = (required && !v) || (v && rule && rules[rule] && !rules[rule](v));
      var err = errFor(list);
      if (err) err.textContent = bad ? msgFor(list, err) : '';
      list.forEach(function (x) { if (bad) x.setAttribute('aria-invalid', 'true'); else x.removeAttribute('aria-invalid'); });
      return !bad;
    };

    Object.keys(groups).forEach(function (name) {
      groups[name].forEach(function (el) {
        var ev = (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'blur';
        el.addEventListener(ev, function () { if (valueOf(groups[name]) || el.getAttribute('aria-invalid')) check(name); });
        if (ev === 'blur') el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) check(name); });
      });
    });

    var labelOf = function (list) {
      var l = list[0].getAttribute('data-label');
      if (l) return l;
      var lab = list[0].id && $('label[for="' + list[0].id + '"]', form);
      return lab ? lab.textContent.replace('*', '').replace('(optional)', '').trim() : list[0].name;
    };
    var displayValue = function (list) {
      var f = list[0];
      if (f.tagName === 'SELECT') return f.selectedIndex > 0 ? f.options[f.selectedIndex].text : '';
      var v = valueOf(list);
      if (f.getAttribute('data-rule') === 'url' && v && !/^https?:\/\//i.test(v)) v = 'https://' + v;
      return v;
    };
    var collect = function () {
      var rows = [];
      Object.keys(groups).forEach(function (name) {
        var v = displayValue(groups[name]);
        if (v) rows.push([labelOf(groups[name]), v]);
      });
      return rows;
    };

    var node = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };

    var showFallback = function (lead) {
      var rows = collect();
      var intro = form.getAttribute('data-wa-intro') || 'Enquiry';
      var text = 'Hello Local Edge, I would like to share the following ' + intro.toLowerCase() + '.\n\n' +
        rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') +
        '\n\nPlease let me know if you need any more information.';
      var wa = 'https://wa.me/' + (contact.whatsapp || '') + '?text=' + encodeURIComponent(text);
      var mail = 'mailto:' + (contact.email || '') + '?subject=' + encodeURIComponent(form.getAttribute('data-subject') || intro) + '&body=' + encodeURIComponent(text);
      statusEl.className = 'form-status is-fallback';
      statusEl.textContent = '';
      statusEl.appendChild(node('p', 'st-lead', lead));
      statusEl.appendChild(node('p', '', 'Your message is prepared, but it has not been sent or saved. Choose WhatsApp or email, then press Send in that app. You can also copy the message and send it another way.'));
      var row = node('div', 'st-actions', '');
      var a1 = node('a', 'btn btn-whatsapp btn-sm', 'Send on WhatsApp'); a1.href = wa; a1.target = '_blank'; a1.rel = 'noopener noreferrer';
      var a2 = node('a', 'btn btn-outline-navy btn-sm', 'Send by email'); a2.href = mail;
      var b3 = node('button', 'btn btn-outline-navy btn-sm', 'Copy message'); b3.type = 'button';
      b3.addEventListener('click', function () {
        var done = function () { b3.textContent = 'Copied'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { b3.textContent = 'Copy not available'; });
        else { var t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done(); } catch (er) { b3.textContent = 'Copy not available'; } document.body.removeChild(t); }
      });
      row.appendChild(a1); row.appendChild(a2); row.appendChild(b3);
      statusEl.appendChild(row);
      statusEl.setAttribute('data-wa-href', wa);
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.className = 'form-status'; statusEl.textContent = '';
      var firstBad = null;
      Object.keys(groups).forEach(function (name) { if (!check(name) && !firstBad) firstBad = groups[name][0]; });
      if (firstBad) {
        firstBad.focus();
        statusEl.className = 'form-status bad';
        statusEl.textContent = 'Please check the highlighted questions and try again.';
        return;
      }
      var hp = form.elements._gotcha; if (hp && hp.value) return;   // honeypot

      if (!endpoint) {
        showFallback('Your details are ready. One final step is needed to send them.');
        return;
      }

      var submit = $('button[type="submit"]', form);
      submit.disabled = true;
      statusEl.className = 'form-status'; statusEl.textContent = 'Sending...';
      var data = new FormData(form);
      Object.keys(groups).forEach(function (name) { var f = groups[name][0]; if (f.getAttribute('data-rule') === 'url') { var v = displayValue(groups[name]); if (v) data.set(name, v); } });
      data.append('_subject', form.getAttribute('data-subject') || 'Website form');
      fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          Object.keys(groups).forEach(function (n) { var er = errFor(groups[n]); if (er) er.textContent = ''; groups[n].forEach(function (x) { x.removeAttribute('aria-invalid'); }); });
          statusEl.className = 'form-status ok';
          statusEl.textContent = type === 'feedback'
            ? 'Thank you. Your feedback has been sent. It stays private unless you gave permission to publish it.'
            : 'Thank you. Your request has been sent to Local Edge. I will reply by the method you chose.';
        })
        .catch(function () { showFallback('Automatic delivery failed. You can still send your details using one of the options below.'); statusEl.className = 'form-status bad is-fallback'; })
        .then(function () { submit.disabled = false; });
    });
  }
  $$('form[data-form]').forEach(initForm);

  // Contact page: pre-select the service from the finder or a package button
  var enq = $('form[data-form="enquiry"]');
  if (enq && window.URLSearchParams) {
    var qs = new URLSearchParams(window.location.search);
    var svc = qs.get('service'), plan = qs.get('plan'), sug = qs.get('suggested');
    var map = { starter: 'new', business: 'new', advanced: 'new', hospitality: 'hospitality', care: 'care', improve: 'improve', new: 'new', unsure: 'unsure' };
    var sel = enq.elements.service;
    if (svc && map[svc] && sel) sel.value = map[svc];
    var hint = $('[data-finder-hint]');
    var names = { starter: 'Starter Website', business: 'Business Website', hospitality: 'Hospitality Website', advanced: 'Advanced Website' };
    var planNames = { care: 'Website Care', growth: 'Website Growth', partner: 'Digital Partner' };
    var text = '';
    if (sug && qs.get('from') === 'finder') text = 'Suggested by the service-fit finder: ' + sug + '. You can change the service below.';
    else if (plan && planNames[plan] && C.retainers) text = 'You asked about ' + planNames[plan] + ' (' + money(C.retainers[plan]) + '/month).';
    else if (svc && names[svc] && C.prices) text = 'You asked about the ' + names[svc] + ' (from ' + money(C.prices[svc]) + ').';
    if (hint && text) { hint.textContent = text; hint.hidden = false; }
    var msg = enq.elements.message;
    if (msg && !msg.value) {
      if (plan && planNames[plan]) msg.value = 'I would like to ask about the ' + planNames[plan] + ' plan.';
      else if (svc && names[svc]) msg.value = 'I would like to ask about the ' + names[svc] + '.';
    }
  }

  /* ================= 6. READING TOOLS ================= */

  var bar = $('[data-progress-bar]');
  var prose = $('.article .prose');
  if (bar && prose) {
    var ticking = false;
    var update = function () {
      var r = prose.getBoundingClientRect();
      var total = r.height - window.innerHeight * 0.6;
      var done = Math.min(1, Math.max(0, (-r.top + window.innerHeight * 0.2) / Math.max(total, 1)));
      bar.style.transform = 'scaleX(' + done.toFixed(3) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Table of contents: highlight the current section
  var toc = $('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var tl = $$('a[href^="#"]', toc), tmap = {};
    tl.forEach(function (a) { tmap[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tl.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
        var l = tmap[en.target.id]; if (l) { l.classList.add('active'); l.setAttribute('aria-current', 'true'); }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(tmap).forEach(function (id) { var h = document.getElementById(id); if (h) tio.observe(h); });
  }

  // Copy link
  $$('[data-copy-link]').forEach(function (btn) {
    var label = $('span', btn);
    btn.addEventListener('click', function () {
      var url = window.location.href.split('#')[0];
      var done = function (t) { if (label) { label.textContent = t; setTimeout(function () { label.textContent = 'Copy link'; }, 2200); } };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { done('Link copied'); }, function () { done('Copy not available'); });
      else { var t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); done('Link copied'); } catch (e) { done('Copy not available'); } document.body.removeChild(t); }
    });
  });
})();
