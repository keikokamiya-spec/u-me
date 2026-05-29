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

  // ── note latest post ──────────────────────────
  const noteTitle = document.getElementById('noteLatestTitle');
  const noteText = document.getElementById('noteLatestText');
  const noteLink = document.getElementById('noteLatestLink');

  const formatNoteDate = value => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const loadLatestNote = async () => {
    if (!noteTitle || !noteText || !noteLink) return;

    try {
      const response = await fetch('/api/note', { headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error('note feed unavailable');

      const data = await response.json();
      if (!data.item) {
        noteLink.href = data.profileUrl || 'https://note.com/ume_nails';
        return;
      }

      const date = formatNoteDate(data.item.date);
      noteTitle.textContent = data.item.title || noteTitle.textContent;
      noteText.textContent = [date, data.item.description].filter(Boolean).join('　');
      noteLink.href = data.item.link || data.profileUrl || 'https://note.com/ume_nails';
      noteLink.textContent = '最新noteを読む';
    } catch (error) {
      noteLink.href = 'https://note.com/ume_nails';
    }
  };

  loadLatestNote();

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

  document.querySelectorAll('.access-route-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      button.classList.toggle('is-open', !isOpen);
      panel.hidden = isOpen;
    });
  });

  document.querySelectorAll('.menu-options-toggle').forEach(button => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      button.classList.toggle('is-open', !isOpen);
      panel.hidden = isOpen;
    });
  });

  // ── Menu manual slideshow ─────────────────────
  document.querySelectorAll('[data-menu-slider]').forEach(slider => {
    const track = slider.querySelector('.menu-cards');
    const cards = Array.from(slider.querySelectorAll('.menu-card'));
    const prevButton = slider.querySelector('[data-menu-prev]');
    const nextButton = slider.querySelector('[data-menu-next]');
    const status = slider.querySelector('[data-menu-status]');
    let currentIndex = 0;

    if (!track || !cards.length || !prevButton || !nextButton || !status) return;

    const updateControls = () => {
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex === cards.length - 1;
      status.textContent = `${currentIndex + 1} / ${cards.length}`;
    };

    const showMenuSlide = index => {
      currentIndex = Math.max(0, Math.min(index, cards.length - 1));
      const left = cards[currentIndex].offsetLeft - track.offsetLeft;
      track.scrollTo({ left, behavior: 'smooth' });
      updateControls();
    };

    prevButton.addEventListener('click', () => showMenuSlide(currentIndex - 1));
    nextButton.addEventListener('click', () => showMenuSlide(currentIndex + 1));

    window.addEventListener('resize', () => showMenuSlide(currentIndex));
    updateControls();
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
