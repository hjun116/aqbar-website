(function () {
  'use strict';

  /* ── Mobile nav ── */
  var toggle = document.querySelector('.m-nav-toggle');
  var panel = document.querySelector('.m-nav-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      document.body.classList.toggle('nav-open', open);
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        panel.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ── FAQ category filter ── */
  document.querySelectorAll('.m-faq-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.m-faq-filter').forEach(function (b) {
        b.dataset.active = 'false';
      });
      btn.dataset.active = 'true';
      var cat = btn.dataset.cat;
      document.querySelectorAll('[data-faq-cat]').forEach(function (item) {
        var show = cat === 'all' || item.dataset.faqCat === cat;
        item.hidden = !show;
        if (!show) {
          var d = item.querySelector('details');
          if (d) d.open = false;
        }
      });
    });
  });

  /* ── Feature segment scroll ── */
  document.querySelectorAll('.m-segment').forEach(function (seg) {
    seg.addEventListener('click', function () {
      document.querySelectorAll('.m-segment').forEach(function (s) {
        s.setAttribute('aria-selected', 'false');
      });
      seg.setAttribute('aria-selected', 'true');
      var target = document.getElementById(seg.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Contact form (demo) ── */
  var form = document.querySelector('.m-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      btn.textContent = '전송되었습니다 ✓';
      btn.disabled = true;
      btn.style.background = '#1fae6b';
    });
  }

  var pricingBtn = document.querySelector('[data-scroll-pricing]');
  if (pricingBtn) {
    pricingBtn.addEventListener('click', function () {
      var el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();
