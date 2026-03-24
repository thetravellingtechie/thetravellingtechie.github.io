/**
 * Salim & Marion — Main JS
 * Vanilla JS, zero dependencies.
 * Features: hero canvas shimmer, nav, reveals, voyage steps, image glow, magnetic buttons.
 */

/* ── 1. Hero Canvas — Golden particle shimmer ── */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const PARTICLE_COUNT = 60;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.3 - 0.1;
      this.radius = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.015;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      const a = this.alpha * (0.5 + Math.sin(this.pulse) * 0.5);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 168, 76, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', resize);
}

/* ── 2. Nav scroll behavior + mobile menu toggle ── */
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const navGlobal = document.getElementById('navGlobal');
  const navSub = document.getElementById('navSub');

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('nav-scrolled', window.scrollY > 80);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Mobile toggle — show/hide global + sub nav
  toggle.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
    if (navGlobal) navGlobal.classList.toggle('show');
    if (navSub) navSub.classList.toggle('show');
  });

  // Close on link click
  nav.querySelectorAll('.nav-global a, .nav-sub a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      if (navGlobal) navGlobal.classList.remove('show');
      if (navSub) navSub.classList.remove('show');
    });
  });
}

/* ── 3. IntersectionObserver reveal for .reveal-up ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
}

/* ── 4. Voyage step accent bar animation ── */
function initVoyageSteps() {
  const steps = document.querySelectorAll('.voyage-step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });

  steps.forEach(step => observer.observe(step));
}

/* ── 5. Image hover glow effect ── */
function initImageGlow() {
  document.querySelectorAll('.voyage-gallery').forEach(container => {
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      container.style.setProperty('--glow-x', x + '%');
      container.style.setProperty('--glow-y', y + '%');
    });
  });
}

/* ── 6. Magnetic hover on .btn-primary ── */
function initMagneticBtn() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── 7. Global sparkles — golden micro-bubbles rising ── */
function initSparkles() {
  const canvas = document.getElementById('sparklesCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;
  const particles = [];
  const COUNT = 65;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  class Sparkle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * w;
      this.y = init ? Math.random() * h : h + 10;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.drift = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      // Gold hue variation: from warm gold to pale champagne
      const hue = 38 + Math.random() * 12;
      const sat = 60 + Math.random() * 25;
      const light = 60 + Math.random() * 20;
      this.color = `hsla(${hue}, ${sat}%, ${light}%,`;
    }
    update() {
      this.y += this.speedY;
      this.x += this.drift + Math.sin(this.pulse) * 0.15;
      this.pulse += this.pulseSpeed;
      if (this.y < -20) this.reset(false);
    }
    draw() {
      const a = this.opacity * (0.4 + Math.sin(this.pulse) * 0.6);
      if (a < 0.02) return;
      // Soft glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${a * 0.15})`;
      ctx.fill();
      // Bright core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    for (let i = 0; i < COUNT; i++) particles.push(new Sparkle());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  init();
  animate();

  // Resize on scroll height change (sections loading)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });
  // Also resize after page fully loaded
  window.addEventListener('load', resize);
}

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  initSparkles();
  initHeroCanvas();
  initNav();
  initReveal();
  initVoyageSteps();
  initImageGlow();
  initMagneticBtn();
});
