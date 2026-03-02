/**
 * ═══════════════════════════════════════════════════════
 * CUSTOM ANALYTICS EVENTS — The Travelling Techie
 * ═══════════════════════════════════════════════════════
 *
 * Paste this script (or relevant sections) in article pages
 * AFTER the GA4 snippet and after the DOM is ready.
 *
 * All events respect consent: they are no-ops if GA4 is not loaded.
 * ═══════════════════════════════════════════════════════
 */

(function () {
  function track(event, params) {
    if (typeof gtag === 'function') gtag('event', event, params);
  }

  // ── 1. Scroll depth milestones (25%, 50%, 75%, 100%) ──
  const depths = [25, 50, 75, 100];
  const reached = new Set();
  window.addEventListener('scroll', function () {
    const scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    depths.forEach(d => {
      if (scrolled >= d && !reached.has(d)) {
        reached.add(d);
        track('scroll_depth', { depth: d, page: window.location.pathname });
      }
    });
  }, { passive: true });

  // ── 2. Article read completion (scroll ≥ 80% + min 60s on page) ──
  let timeOnPage = 0;
  let readFired  = false;
  const ticker   = setInterval(() => {
    timeOnPage++;
    if (!readFired && timeOnPage >= 60 && reached.has(75)) {
      readFired = true;
      clearInterval(ticker);
      track('article_read', {
        page:     window.location.pathname,
        time_sec: timeOnPage
      });
    }
  }, 1000);

  // ── 3. Social link clicks ──────────────────────────────
  document.querySelectorAll('a.social-link, a.footer-icon, a.footer-icon-btn, a.share-btn, a.share-sidebar-btn').forEach(link => {
    link.addEventListener('click', function () {
      const label = this.getAttribute('aria-label') || this.getAttribute('title') || 'unknown';
      track('social_click', { platform: label, page: window.location.pathname });
    });
  });

  // ── 4. Language toggle ────────────────────────────────
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function () {
      const current = localStorage.getItem('ttt-lang') || 'fr';
      track('language_toggle', { from: current, to: current === 'fr' ? 'en' : 'fr' });
    });
  }
  // Article pages use buttons directly
  ['langFR', 'langEN'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', function () {
        track('language_toggle', { to: id === 'langFR' ? 'fr' : 'en', page: window.location.pathname });
      });
    }
  });

  // ── 5. Chapter navigation clicks ─────────────────────
  document.querySelectorAll('.chapter-item').forEach(item => {
    item.addEventListener('click', function () {
      track('chapter_nav', {
        target:  this.getAttribute('href') || 'top',
        page:    window.location.pathname
      });
    });
  });

  // ── 6. External link clicks ───────────────────────────
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function () {
      track('outbound_click', {
        url:  this.href,
        page: window.location.pathname
      });
    });
  });

})();
