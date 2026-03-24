/**
 * The Traveling Techie — Shared Global Nav
 * Injects a two-level navigation on every page:
 *   Level 1: Global nav (Dispatch | Learn | Lab | Aventure | About)
 *   Level 2: Page-specific sub-nav (defined per page via data attribute)
 *
 * Usage: <div id="ttt-nav" data-section="dispatch" data-subnav='[{"label":"Articles","href":"#articles"},...]'></div>
 *        <script src="/shared/nav.js"></script>
 *
 * Attributes:
 *   data-section  — active section key (dispatch|learn|lab|aventure|about|home)
 *   data-subnav   — JSON array of {fr, en, href} for page-specific sub-links (optional)
 */

(function () {
  const container = document.getElementById('ttt-nav');
  if (!container) return;

  const activeSection = container.dataset.section || '';
  let subnavItems = [];
  try { subnavItems = JSON.parse(container.dataset.subnav || '[]'); } catch (e) {}

  const GLOBAL_LINKS = [
    { href: '/dispatch/', fr: 'Dispatch', en: 'Dispatch', key: 'dispatch' },
    { href: '/learn/',    fr: 'Apprendre', en: 'Learn',   key: 'learn' },
    { href: '/lab/',      fr: 'Lab',       en: 'Lab',     key: 'lab' },
    { href: '/aventure/', fr: 'Aventure',  en: 'Adventure', key: 'aventure' },
    { href: '/about/',    fr: 'À propos',  en: 'About',   key: 'about' },
  ];

  // Build global nav links
  const globalLinksHTML = GLOBAL_LINKS.map(l =>
    `<a href="${l.href}" class="${l.key === activeSection ? 'active' : ''}" data-fr="${l.fr}" data-en="${l.en}">${l.fr}</a>`
  ).join('\n            ');

  // Build mobile overlay links
  const mobileLinksHTML = GLOBAL_LINKS.map(l =>
    `<a href="${l.href}" class="${l.key === activeSection ? 'active' : ''}" data-fr="${l.fr}" data-en="${l.en}">${l.fr}</a>`
  ).join('\n        ');

  // Build subnav
  const subnavHTML = subnavItems.length > 0 ? `
    <div class="subnav" id="subnav">
      <div class="subnav-inner">
        ${subnavItems.map(s =>
          `<a href="${s.href}" data-fr="${s.fr}" data-en="${s.en}">${s.fr}</a>`
        ).join('\n        ')}
      </div>
    </div>` : '';

  // Inject HTML
  container.innerHTML = `
    <div class="nav-mobile-overlay" id="navMobileOverlay">
        ${mobileLinksHTML}
    </div>
    <nav id="navbar">
        <a href="/" class="nav-logo">The Traveling Techie</a>
        <div class="nav-center">
            ${globalLinksHTML}
        </div>
        <div class="lang-toggle" id="langToggle" role="button" aria-label="Toggle language" tabindex="0">
            <span id="langFR" class="active">FR</span>
            <span id="langEN">EN</span>
        </div>
        <button class="nav-hamburger" id="navHamburger" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>${subnavHTML}`;

  // ── Nav scroll behavior ──
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── Hamburger toggle ──
  const hamburger = document.getElementById('navHamburger');
  const overlay = document.getElementById('navMobileOverlay');
  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      overlay.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        overlay.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  // ── Language toggle ──
  const LANG_KEY = 'ttt-lang';
  let currentLang = localStorage.getItem(LANG_KEY) || 'fr';
  const langFR = document.getElementById('langFR');
  const langEN = document.getElementById('langEN');
  const toggle = document.getElementById('langToggle');

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    langFR.classList.toggle('active', lang === 'fr');
    langEN.classList.toggle('active', lang === 'en');
    document.querySelectorAll('[data-fr][data-en]').forEach(el => {
      const val = lang === 'fr' ? el.dataset.fr : el.dataset.en;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    });
    document.documentElement.lang = lang;
  }

  toggle.addEventListener('click', () => applyLang(currentLang === 'fr' ? 'en' : 'fr'));
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyLang(currentLang === 'fr' ? 'en' : 'fr'); }
  });

  applyLang(currentLang);
})();
