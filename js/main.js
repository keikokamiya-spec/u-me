/* u/me nail salon — main.js */

document.addEventListener('DOMContentLoaded', () => {

  // ── Header scroll ──────────────────────────────
  const header       = document.getElementById('header');
  const fixedBtn     = document.getElementById('fixedReserveBtn');

  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('is-scrolled', scrolled);
    fixedBtn.classList.toggle('is-visible', scrolled);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Hamburger / Nav ────────────────────────────
  const gnavBtn     = document.getElementById('gnavBtn');
  const gnavClose   = document.getElementById('gnavClose');
  const gnav        = document.getElementById('gnav');
  const overlay     = document.getElementById('gnavOverlay');

  const openNav = () => {
    gnav.classList.add('is-open');
    overlay.classList.add('is-active');
    gnavBtn.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    gnav.classList.remove('is-open');
    overlay.classList.remove('is-active');
    gnavBtn.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  gnavBtn.addEventListener('click', openNav);
  gnavClose.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  gnav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // ── MV Slideshow ───────────────────────────────
  const slides = document.querySelectorAll('.mv-slide');
  let current = 0;

  const tick = () => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  };
  setInterval(tick, 5000);

  // ── Scroll animation ───────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Stagger gallery items
  document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // ── Smooth scroll ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
