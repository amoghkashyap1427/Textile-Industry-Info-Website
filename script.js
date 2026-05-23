/* ══════════════════════════════════════════════════════════════
   UDAY CREATIONS — Vanilla JavaScript
   Hamburger nav · Sticky header · Scroll reveal · Lightbox
══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────
     STICKY NAVIGATION — add 'scrolled' class on scroll
  ────────────────────────────────────────────────────── */
  const navHeader = document.getElementById('nav-header');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load


  /* ──────────────────────────────────────────────────────
     HAMBURGER MENU — mobile full-screen overlay
  ────────────────────────────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const mobileNav    = document.getElementById('mobile-nav');
  const mobileClose  = document.getElementById('mobile-nav-close');
  const navCloseLinks = document.querySelectorAll('[data-nav-close]');

  let isMenuOpen = false;

  function openMenu() {
    isMenuOpen = true;
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first link for accessibility
    const firstLink = mobileNav.querySelector('.mobile-nav-link');
    if (firstLink) firstLink.focus();
  }

  function closeMenu() {
    isMenuOpen = false;
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    isMenuOpen ? closeMenu() : openMenu();
  });

  mobileClose.addEventListener('click', closeMenu);

  navCloseLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click (clicking outside the nav links area)
  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) closeMenu();
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) closeMenu();
  });


  /* ──────────────────────────────────────────────────────
     SMOOTH SCROLL — for anchor links with offset for sticky nav
  ────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navHeader.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });


  /* ──────────────────────────────────────────────────────
     SCROLL REVEAL — Intersection Observer
  ────────────────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after revealing for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────────────────
     GALLERY LIGHTBOX
  ────────────────────────────────────────────────────── */
  const galleryItems  = document.querySelectorAll('.gallery-item');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxCap   = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev  = document.getElementById('lightbox-prev');
  const lightboxNext  = document.getElementById('lightbox-next');

  let currentIndex = 0;

  // Build image data array from gallery items
  const galleryData = Array.from(galleryItems).map(item => ({
    src:   item.querySelector('img').src,
    alt:   item.querySelector('img').alt,
    label: item.querySelector('.gallery-label').textContent.trim()
  }));

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Return focus to the gallery item that opened the lightbox
    if (galleryItems[currentIndex]) galleryItems[currentIndex].focus();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const data = galleryData[currentIndex];
    lightboxImg.src   = data.src;
    lightboxImg.alt   = data.alt;
    lightboxCap.textContent = data.label;
  }

  // Open lightbox on click or Enter/Space on gallery items
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation inside lightbox
  lightbox.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    switch (e.key) {
      case 'Escape':    closeLightbox(); break;
      case 'ArrowRight': showNext();    break;
      case 'ArrowLeft':  showPrev();    break;
    }
  });

  // Touch swipe support for lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? showNext() : showPrev();
    }
  }, { passive: true });


  /* ──────────────────────────────────────────────────────
     SERVICE CARDS — keyboard interaction
  ────────────────────────────────────────────────────── */
  // Service cards are focusable for accessibility, no additional JS needed
  // Their hover/focus styles are handled in CSS


  /* ──────────────────────────────────────────────────────
     ACTIVE NAV LINK — highlight current section
  ────────────────────────────────────────────────────── */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--gold)';
          }
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

});
