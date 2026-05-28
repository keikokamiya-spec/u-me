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
    if (!slides.length) return;
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  };
  if (slides.length) {
    setInterval(tick, 5000);
  }

  // ── Concept accordion ─────────────────────────
  document.querySelectorAll('.concept-catch-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      button.classList.toggle('is-open', !isOpen);
      panel.hidden = isOpen;
    });
  });

  document.querySelectorAll('.concept-service-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      button.classList.toggle('is-open', !isOpen);
      panel.hidden = isOpen;
    });
  });

  document.querySelectorAll('.concept-profile-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      button.classList.toggle('is-open', !isOpen);
      panel.hidden = isOpen;
    });
  });

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

  // ── Mobile gallery slideshow ──────────────────
  const galleryGrid = document.querySelector('.gallery-grid');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const mobileQuery = window.matchMedia('(max-width: 767px)');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let galleryCurrent = 0;
  let galleryTimer = null;

  const showGallerySlide = index => {
    if (!galleryGrid || !galleryItems.length) return;
    galleryCurrent = (index + galleryItems.length) % galleryItems.length;
    galleryGrid.scrollTo({
      left: galleryGrid.clientWidth * galleryCurrent,
      behavior: reduceMotionQuery.matches ? 'auto' : 'smooth'
    });
  };

  const startGallerySlideshow = () => {
    if (!galleryGrid || !mobileQuery.matches || reduceMotionQuery.matches) return;
    if (galleryTimer) return;
    galleryTimer = setInterval(() => {
      showGallerySlide(galleryCurrent + 1);
    }, 3600);
  };

  const stopGallerySlideshow = () => {
    if (!galleryTimer) return;
    clearInterval(galleryTimer);
    galleryTimer = null;
  };

  const updateGallerySlideshow = () => {
    if (!galleryGrid) return;
    if (mobileQuery.matches) {
      showGallerySlide(galleryCurrent);
      if (reduceMotionQuery.matches) {
        stopGallerySlideshow();
      } else {
        startGallerySlideshow();
      }
    } else {
      stopGallerySlideshow();
      galleryGrid.scrollTo({ left: 0, behavior: 'auto' });
      galleryCurrent = 0;
    }
  };

  updateGallerySlideshow();
  mobileQuery.addEventListener('change', updateGallerySlideshow);
  reduceMotionQuery.addEventListener('change', updateGallerySlideshow);

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
