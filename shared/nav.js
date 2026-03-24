/**
 * TTT — Shared Navigation Component
 * Two-level nav: global (site-wide) + sub-nav (page-specific)
 * Bilingual FR/EN with localStorage sync
 * Accent colors per section
 *
 * Usage:
 *   <div id="ttt-nav"
 *        data-section="dispatch"
 *        data-subnav='[{"fr":"Articles","en":"Articles","href":"#articles"}]'>
 *   </div>
 *   <script src="/shared/nav.js"></script>
 *
 * data-section: home|dispatch|learn|lab|aventure|about
 * data-subnav: JSON array (optional)
 * data-logo: custom logo text (optional, default "The Traveling Techie")
 * data-logo-href: custom logo link (optional, default "/")
 */

(function () {
  const container = document.getElementById('ttt-nav');
  if (!container) return;

  const section = container.dataset.section || 'home';
  const logoText = container.dataset.logo || 'The Traveling Techie';
  const logoHref = container.dataset.logoHref || '/';
  let subnav = [];
  try { subnav = JSON.parse(container.dataset.subnav || '[]'); } catch (e) {}

  // Section accent colors
  const ACCENTS = {
    home:     { color: '#6366f1', name: 'Indigo' },
    dispatch: { color: '#e11d48', name: 'Ruby' },
    learn:    { color: '#8b5cf6', name: 'Violet' },
    lab:      { color: '#10b981', name: 'Emerald' },
    aventure: { color: '#C9A84C', name: 'Gold' },
    about:    { color: '#0ea5e9', name: 'Sky' },
  };

  const accent = ACCENTS[section] || ACCENTS.home;

  const LINKS = [
    { href: '/dispatch/', key: 'dispatch', fr: 'Dispatch',  en: 'Dispatch' },
    { href: '/learn/',    key: 'learn',    fr: 'Apprendre', en: 'Learn' },
    { href: '/lab/',      key: 'lab',      fr: 'Lab',       en: 'Lab' },
    { href: '/aventure/', key: 'aventure', fr: 'Aventure',  en: 'Adventure' },
    { href: '/about/',    key: 'about',    fr: 'À propos',  en: 'About' },
  ];

  // Build links HTML
  const linksHTML = (cls, sep) => LINKS.map(l =>
    `<a href="${l.href}" class="${cls} ${l.key === section ? 'active' : ''}" data-fr="${l.fr}" data-en="${l.en}">${l.fr}</a>`
  ).join(sep);

  // Build subnav HTML
  const subnavHTML = subnav.length > 0 ? `
    <div class="ttt-subnav" id="tttSubnav">
      <div class="ttt-subnav-inner">
        ${subnav.map(s => `<a href="${s.href}" data-fr="${s.fr}" data-en="${s.en}">${s.fr}</a>`).join('\n        ')}
      </div>
    </div>` : '';

  // Build mobile menu — global links + subnav links
  const mobileSubnavHTML = subnav.length > 0
    ? `<div class="ttt-mobile-divider"></div>` + subnav.map(s =>
        `<a href="${s.href}" class="ttt-mobile-sub" data-fr="${s.fr}" data-en="${s.en}">${s.fr}</a>`
      ).join('\n        ')
    : '';

  // Inject
  container.innerHTML = `
    <div class="ttt-mobile-overlay" id="tttMobileOverlay">
        ${linksHTML('ttt-mobile-link', '\n        ')}
        ${mobileSubnavHTML}
    </div>
    <nav class="ttt-navbar" id="tttNavbar">
      <a href="${logoHref}" class="ttt-logo">${logoText}</a>
      <div class="ttt-nav-center">
        ${linksHTML('ttt-nav-link', '\n        ')}
      </div>
      <div class="ttt-lang" id="tttLang" role="button" aria-label="Toggle language" tabindex="0">
        <span id="langFR" class="active">FR</span>
        <span id="langEN">EN</span>
      </div>
      <button class="ttt-hamburger" id="tttHamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>${subnavHTML}`;

  // Inject accent color as CSS variable
  container.style.setProperty('--section-accent', accent.color);

  // ── Scroll ──
  const navbar = document.getElementById('tttNavbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

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
