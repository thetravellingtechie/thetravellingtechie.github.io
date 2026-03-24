/**
 * TTT — Shared Navigation Component
 * Single-bar nav with toggle between global links and page sub-links
 * Bilingual FR/EN with localStorage sync
 * Accent colors per section
 *
 * Usage:
 *   <div id="ttt-nav"
 *        data-section="dispatch"
 *        data-subnav='[{"fr":"Articles","en":"Articles","href":"#articles"}]'>
 *   </div>
 *   <script src="/shared/nav.js"></script>
 */

(function () {
  const container = document.getElementById('ttt-nav');
  if (!container) return;

  const section = container.dataset.section || 'home';
  const logoText = container.dataset.logo || 'The Traveling Techie';
  const logoHref = container.dataset.logoHref || '/';
  let subnav = [];
  try { subnav = JSON.parse(container.dataset.subnav || '[]'); } catch (e) {}

  const ACCENTS = {
    home:     { color: '#6366f1' },
    dispatch: { color: '#e11d48' },
    learn:    { color: '#8b5cf6' },
    lab:      { color: '#10b981' },
    aventure: { color: '#C9A84C' },
    about:    { color: '#0ea5e9' },
  };

  const accent = ACCENTS[section] || ACCENTS.home;

  const LINKS = [
    { href: '/dispatch/', key: 'dispatch', fr: 'Dispatch',  en: 'Dispatch' },
    { href: '/learn/',    key: 'learn',    fr: 'Apprendre', en: 'Learn' },
    { href: '/lab/',      key: 'lab',      fr: 'Lab',       en: 'Lab' },
    { href: '/aventure/', key: 'aventure', fr: 'Aventure',  en: 'Adventure' },
    { href: '/about/',    key: 'about',    fr: 'À propos',  en: 'About' },
  ];

  const hasSubnav = subnav.length > 0;

  // Build global links — active link gets a toggle role if subnav exists
  const globalLinksHTML = LINKS.map(l => {
    const isActive = l.key === section;
    const cls = `ttt-nav-link ${isActive ? 'active' : ''}`;
    if (isActive && hasSubnav) {
      return `<a href="javascript:void(0)" class="${cls}" id="tttToggleSubnav" data-fr="${l.fr}" data-en="${l.en}" title="Show page sections">${l.fr}</a>`;
    }
    return `<a href="${l.href}" class="${cls}" data-fr="${l.fr}" data-en="${l.en}">${l.fr}</a>`;
  }).join('\n        ');

  // Build subnav links with back arrow
  const subnavLinksHTML = hasSubnav ? `
        <a href="javascript:void(0)" class="ttt-nav-back" id="tttBackToGlobal" title="Back to main menu">←</a>
        ${subnav.map(s => `<a href="${s.href}" class="ttt-nav-link ttt-sub-link" data-fr="${s.fr}" data-en="${s.en}">${s.fr}</a>`).join('\n        ')}` : '';

  // Mobile menu
  const mobileSubnavHTML = hasSubnav
    ? `<div class="ttt-mobile-divider"></div>` + subnav.map(s =>
        `<a href="${s.href}" class="ttt-mobile-sub" data-fr="${s.fr}" data-en="${s.en}">${s.fr}</a>`
      ).join('\n        ')
    : '';

  const mobileLinksHTML = LINKS.map(l =>
    `<a href="${l.href}" class="ttt-mobile-link ${l.key === section ? 'active' : ''}" data-fr="${l.fr}" data-en="${l.en}">${l.fr}</a>`
  ).join('\n        ');

  // Inject
  container.innerHTML = `
    <div class="ttt-mobile-overlay" id="tttMobileOverlay">
        ${mobileLinksHTML}
        ${mobileSubnavHTML}
    </div>
    <nav class="ttt-navbar" id="tttNavbar">
      <a href="${logoHref}" class="ttt-logo">${logoText}</a>
      <div class="ttt-nav-center" id="tttNavCenter">
        <div class="ttt-nav-layer ttt-nav-global active" id="tttGlobalLayer">
          ${globalLinksHTML}
        </div>
        ${hasSubnav ? `<div class="ttt-nav-layer ttt-nav-sub" id="tttSubLayer">${subnavLinksHTML}</div>` : ''}
      </div>
      <div class="ttt-lang" id="tttLang" role="button" aria-label="Toggle language" tabindex="0">
        <span id="langFR" class="active">FR</span>
        <span id="langEN">EN</span>
      </div>
      <button class="ttt-hamburger" id="tttHamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>`;

  container.style.setProperty('--section-accent', accent.color);

  // ── Scroll ──
  const navbar = document.getElementById('tttNavbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── Toggle subnav / global ──
  if (hasSubnav) {
    const globalLayer = document.getElementById('tttGlobalLayer');
    const subLayer = document.getElementById('tttSubLayer');
    const toggleBtn = document.getElementById('tttToggleSubnav');
    const backBtn = document.getElementById('tttBackToGlobal');

    function showSub() {
      globalLayer.classList.remove('active');
      subLayer.classList.add('active');
    }

    function showGlobal() {
      subLayer.classList.remove('active');
      globalLayer.classList.add('active');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', showSub);
    if (backBtn) backBtn.addEventListener('click', showGlobal);

    // Close sub-nav when clicking a sub-link (anchor navigation)
    subLayer.querySelectorAll('.ttt-sub-link').forEach(a => {
      a.addEventListener('click', () => {
        // Keep subnav visible while navigating sections
      });
    });
  }

  // ── Hamburger ──
  const hamburger = document.getElementById('tttHamburger');
  const overlay = document.getElementById('tttMobileOverlay');
  hamburger.addEventListener('click', () => {
    overlay.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  overlay.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      overlay.classList.remove('open');
      hamburger.classList.remove('open');
    })
  );

  // ── Language toggle ──
  const LANG_KEY = 'ttt-lang';
  let lang = localStorage.getItem(LANG_KEY) || 'fr';
  const langFR = document.getElementById('langFR');
  const langEN = document.getElementById('langEN');
  const langToggle = document.getElementById('tttLang');

  function applyLang(l) {
    lang = l;
    localStorage.setItem(LANG_KEY, l);
    langFR.classList.toggle('active', l === 'fr');
    langEN.classList.toggle('active', l === 'en');
    document.querySelectorAll('[data-fr][data-en]').forEach(el => {
      const v = l === 'fr' ? el.dataset.fr : el.dataset.en;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = v;
      else el.innerHTML = v;
    });
    document.documentElement.lang = l;
  }

  langToggle.addEventListener('click', () => applyLang(lang === 'fr' ? 'en' : 'fr'));
  langToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); applyLang(lang === 'fr' ? 'en' : 'fr'); }
  });

  applyLang(lang);
})();
