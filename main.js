(() => {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 12) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('is-open');
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target || '0');
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* ---------- Skill bar fill ---------- */
  const bars = document.querySelectorAll('[data-bar]');
  if ('IntersectionObserver' in window && bars.length) {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = (el.dataset.percent || 0) + '%';
          barObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    bars.forEach(el => barObserver.observe(el));
  } else {
    bars.forEach(el => { el.style.width = (el.dataset.percent || 0) + '%'; });
  }

  /* ---------- Portfolio filters ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxMedia = document.getElementById('lightboxMedia');
  const lightboxImage = document.getElementById('lightboxImage');

  const openLightbox = (title, imgEl) => {
    if (!lightbox) return;

    const hasRealImage = imgEl && imgEl.tagName === 'IMG' && !imgEl.closest('.img-fallback') && imgEl.currentSrc;

    if (hasRealImage) {
      lightboxImage.src = imgEl.currentSrc || imgEl.src;
      lightboxImage.alt = imgEl.alt || title || 'Preview';
      lightboxImage.style.display = 'block';
      if (lightboxMedia) lightboxMedia.style.display = 'none';
    } else {
      lightboxImage.removeAttribute('src');
      lightboxImage.style.display = 'none';
      if (lightboxMedia) {
        lightboxMedia.style.display = 'flex';
        lightboxMedia.textContent = title
          ? `${title} — upload an image to replace this preview.`
          : 'Work sample placeholder — upload an image to replace this preview.';
      }
    }

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('[data-lightbox]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const card = trigger.closest('.project-card') || trigger.closest('.cert-card');
      const title = card ? card.querySelector('.project-card__title, .cert-card__title')?.textContent : '';
      const imgEl = card ? card.querySelector('.project-image, .cert-image') : null;
      openLightbox(title, imgEl);
    });
  });
  document.querySelectorAll('[data-lightbox-close]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- Contact form (front-end only) ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        formStatus.textContent = 'Please fill in all fields before sending.';
        return;
      }
      formStatus.textContent = 'Thanks — your message has been noted. I\'ll reply soon.';
      contactForm.reset();
    });
  }

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
