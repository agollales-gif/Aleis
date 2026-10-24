/**
 * ALEIS — Digital Engineering & Creative Studio
 * High-Performance Interactive Engine:
 * 1. Cinematic Boot Preloader (Bypassed on mobile, fast on desktop)
 * 2. Live Telemetry Clock (Instant local timezone, deferred IP lookup)
 * 3. Hero Harmonic Wave + Particle Field (Offscreen paused, optimized step)
 * 4. Dual-Ring Magnetic Cursor & Spotlight Tracking (Pointer-fine only)
 * 5. 3D Perspective Tilt Cards (Pointer-fine only)
 * 6. High-Performance Native IntersectionObserver Reveals
 * 7. Works Filter, Case Study Modal & Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  // Critical interactive systems initialized immediately
  initNavbarAndMobileMenu();
  initNativeScrollAnimations();
  initPortfolioFilterAndModal();
  initContactForm();

  // Non-critical visual eye-candy deferred to idle to protect FCP, LCP & TBT
  const bootSecondaryEnhancements = () => {
    initPreloader();
    initLiveTelemetryClock();
    initHeroHarmonicCanvas();
    initCustomCursorAndSpotlights();
    init3DTiltCards();
    initMagneticElements();
    initAnimatedFavicon();
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(bootSecondaryEnhancements, { timeout: 1200 });
  } else {
    setTimeout(bootSecondaryEnhancements, 80);
  }
});

/* ==========================================================================
   1. Cinematic Boot Preloader
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('aleis-preloader');
  if (!preloader) return;

  // On mobile or if already marked loaded, bypass immediately
  if (window.innerWidth < 768) {
    preloader.classList.add('is-loaded');
    return;
  }

  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');
  let progress = 0;
  const duration = 240;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    progress = Math.min(100, Math.floor((elapsed / duration) * 100));
    if (counterEl) counterEl.textContent = `${progress}%`;
    if (barEl) barEl.style.width = `${progress}%`;

    if (progress < 100) {
      requestAnimationFrame(step);
    } else {
      preloader.classList.add('is-loaded');
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   2. Live Visitor Country / Location & Real-Time Local Clock
   ========================================================================== */
function initLiveTelemetryClock() {
  const headerClockEl = document.getElementById('studio-live-clock');
  const footerLocationEl = document.getElementById('footer-user-location');
  const footerTimeEl = document.getElementById('footer-user-time');

  // Instant timezone-based location detection (0ms latency & offline-ready)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const tzParts = tz.split('/');
  const city = (tzParts[tzParts.length - 1] || 'LOCAL').replace(/_/g, ' ');
  const region = tzParts.length > 1 ? tzParts[0] : '';
  let detectedPlace = region ? `${city}, ${region}` : city;

  if (footerLocationEl) {
    footerLocationEl.textContent = detectedPlace;
  }

  // Defer optional 3rd-party IP geo enrichment so it never blocks page load
  const fetchGeo = () => {
    fetch('https://ipapi.co/json/')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.country_name) {
          detectedPlace = data.city ? `${data.city}, ${data.country_name}` : data.country_name;
          if (footerLocationEl) {
            footerLocationEl.textContent = detectedPlace;
          }
        }
      })
      .catch(() => {});
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(fetchGeo, { timeout: 3500 });
  } else {
    setTimeout(fetchGeo, 2500);
  }

  function updateClocks() {
    const now = new Date();
    const localTimeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const offsetMins = -now.getTimezoneOffset();
    const sign = offsetMins >= 0 ? '+' : '-';
    const offsetHrs = Math.floor(Math.abs(offsetMins) / 60);
    const gmtLabel = `GMT${sign}${offsetHrs}`;

    if (footerTimeEl) {
      footerTimeEl.textContent = `${localTimeStr} (${gmtLabel})`;
    }

    if (headerClockEl) {
      headerClockEl.textContent = `${city.toUpperCase()} • ${localTimeStr}`;
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* ==========================================================================
   3. Hero Harmonic Wave + Interactive Particle Field Canvas
   ========================================================================== */
function initHeroHarmonicCanvas() {
  const canvas = document.getElementById('aleis-hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isMobile = window.innerWidth < 768;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
  let height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
  let time = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;
  let isHeroVisible = true;
  let rafId = null;

  const particleCount = isMobile ? 14 : 28;
  const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.4 + 0.5,
    vx: (Math.random() - 0.5) * 0.0003,
    vy: (Math.random() - 0.5) * 0.0003,
    alpha: Math.random() * 0.35 + 0.12,
  }));

  function resize() {
    if (!canvas.parentElement) return;
    width = canvas.parentElement.clientWidth;
    height = canvas.parentElement.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (!isMobile) {
    window.addEventListener(
      'mousemove',
      (e) => {
        targetMouseX = e.clientX / Math.max(window.innerWidth, 1);
        targetMouseY = e.clientY / Math.max(window.innerHeight, 1);
      },
      { passive: true }
    );
  }

  // Only animate canvas when in viewport — saves 100% CPU when scrolling down
  const heroObserver = new IntersectionObserver(
    (entries) => {
      isHeroVisible = entries[0].isIntersecting;
      if (isHeroVisible && !rafId) {
        render();
      }
    },
    { threshold: 0.05 }
  );
  heroObserver.observe(canvas);

  const waves = [
    { color: 'rgba(0, 240, 255, 0.22)', amp: 38, freq: 0.0045, speed: 0.022, offset: 0 },
    { color: 'rgba(59, 130, 246, 0.18)', amp: 48, freq: 0.0035, speed: 0.016, offset: 1.8 },
    { color: 'rgba(99, 102, 241, 0.14)', amp: 30, freq: 0.0055, speed: 0.026, offset: 3.4 },
  ];

  const stepX = isMobile ? 14 : 8;

  function render() {
    if (!isHeroVisible) {
      rafId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    mouseX += (targetMouseX - mouseX) * 0.07;
    mouseY += (targetMouseY - mouseY) * 0.07;
    time += 1;

    // Draw floating glowing particles
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      const px = p.x * width + (mouseX - 0.5) * 20;
      const py = p.y * height + (mouseY - 0.5) * 20;

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.fill();
    });

    const centerY = height * 0.52 + (mouseY - 0.5) * 45;

    waves.forEach((w) => {
      ctx.beginPath();
      ctx.strokeStyle = w.color;
      ctx.lineWidth = 1.4;

      for (let x = 0; x <= width; x += stepX) {
        const y =
          centerY +
          Math.sin(x * w.freq + time * w.speed + w.offset) * w.amp +
          Math.cos(x * w.freq * 1.6 - time * w.speed * 0.7) * (w.amp * 0.3);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    rafId = requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. Custom Dual-Layer Magnetic Cursor & Spotlight Tracking
   ========================================================================== */
function initCustomCursorAndSpotlights() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const root = document.documentElement;
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorLabel = document.getElementById('cursor-ring-label');
  const cards = document.querySelectorAll('.spotlight-card');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      root.style.setProperty('--cursor-x', `${mouseX}px`);
      root.style.setProperty('--cursor-y', `${mouseY}px`);

      if (cursorDot) {
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;
      }
    },
    { passive: true }
  );

  // Directly attach spotlight to cards on mousemove — ZERO global loop reflows
  cards.forEach((card) => {
    card.addEventListener(
      'mousemove',
      (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      },
      { passive: true }
    );
  });

  if (cursorRing) {
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate3d(-50%, -50%, 0)`;
      requestAnimationFrame(animateRing);
    };
    requestAnimationFrame(animateRing);
  }

  const interactiveEls = document.querySelectorAll('a, button, select, input, textarea');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover-interactive'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover-interactive'));
  });

  const labeledCards = document.querySelectorAll('[data-cursor-label]');
  labeledCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const label = card.getAttribute('data-cursor-label') || 'VIEW';
      if (cursorLabel) cursorLabel.textContent = label;
      document.body.classList.add('cursor-hover-card');
    });
    card.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover-card');
    });
  });
}

/* ==========================================================================
   5. 3D Perspective Card Tilt Effect (.tilt-card)
   ========================================================================== */
function init3DTiltCards() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach((card) => {
    card.addEventListener(
      'mousemove',
      (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;

        card.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      },
      { passive: true }
    );

    card.addEventListener(
      'mouseleave',
      () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      },
      { passive: true }
    );
  });
}

/* ==========================================================================
   6. [data-magnetic] Physics on Buttons & Badges
   ========================================================================== */
function initMagneticElements() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const magnets = document.querySelectorAll('[data-magnetic]');
  magnets.forEach((el) => {
    el.addEventListener(
      'mousemove',
      (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate3d(${x * 0.28}px, ${y * 0.28}px, 0)`;
      },
      { passive: true }
    );

    el.addEventListener(
      'mouseleave',
      () => {
        el.style.transform = 'translate3d(0, 0, 0)';
      },
      { passive: true }
    );
  });
}

/* ==========================================================================
   7. Navigation Header Backdrop & Mobile Drawer
   ========================================================================== */
function initNavbarAndMobileMenu() {
  const header = document.getElementById('site-header');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const menuDrawer = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('menu-icon-open');
  const iconClose = document.getElementById('menu-icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  let lastY = 0;
  window.addEventListener(
    'scroll',
    () => {
      const currentY = window.scrollY;
      if (header) {
        if (currentY > 30) {
          header.classList.add('bg-[#050507]/90', 'border-white/[0.12]', 'shadow-2xl');
          header.classList.remove('bg-[#050507]/65', 'border-white/[0.07]');
        } else {
          header.classList.remove('bg-[#050507]/90', 'border-white/[0.12]', 'shadow-2xl');
          header.classList.add('bg-[#050507]/65', 'border-white/[0.07]');
        }
      }
      lastY = currentY;
    },
    { passive: true }
  );

  function toggleMobileMenu() {
    if (!menuDrawer) return;
    const isHidden = menuDrawer.classList.contains('hidden');

    if (isHidden) {
      menuDrawer.classList.remove('hidden');
      requestAnimationFrame(() => {
        menuDrawer.classList.remove('opacity-0', '-translate-y-2');
        menuDrawer.classList.add('opacity-100', 'translate-y-0');
      });
      iconOpen?.classList.add('hidden');
      iconClose?.classList.remove('hidden');
      toggleBtn?.setAttribute('aria-expanded', 'true');
    } else {
      menuDrawer.classList.remove('opacity-100', 'translate-y-0');
      menuDrawer.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => {
        menuDrawer.classList.add('hidden');
      }, 200);
      iconOpen?.classList.remove('hidden');
      iconClose?.classList.add('hidden');
      toggleBtn?.setAttribute('aria-expanded', 'false');
    }
  }

  toggleBtn?.addEventListener('click', toggleMobileMenu);
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (menuDrawer && !menuDrawer.classList.contains('hidden')) {
        toggleMobileMenu();
      }
    });
  });
}

/* ==========================================================================
   8. Native C++ IntersectionObserver Scroll Animations & Fast Counters
   ========================================================================== */
function initNativeScrollAnimations() {
  const revealEls = document.querySelectorAll('.gs-reveal');

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  revealEls.forEach((el) => revealObs.observe(el));

  // Animated Counters
  const counters = document.querySelectorAll('[data-counter-target]');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter-target') || '0');
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };

  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  counters.forEach((c) => counterObs.observe(c));
}

/* ==========================================================================
   9. Works Filter & Project Preview Modal
   ========================================================================== */
const WORKS_DB = {
  'don-bosko': {
    id: 'FEATURED ECOSYSTEM // FEB 2026 – OCT 2026',
    title: 'Digital Ecosystem — Qendra Sociale Don Bosko Tiranë',
    metric: '4 Integrated Products • Web, Admin, Mobile & Local AI (Ollama)',
    summary:
      'Complete digital and administrative ecosystem built for Qendra Sociale Don Bosko Tiranë: (1) Official Institutional Website, (2) "Sekretaria" Web Admin Platform for school data & automation, (3) Don Bosko Mobile App for student/staff schedules & alerts, and (4) Bosko AI — a real-time conversational assistant powered by local AI models via Ollama.',
    liveUrl: 'https://www.qendradonbosko.com/',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Supabase', 'Local AI (Ollama)', 'Figma (Mobile UI/UX)'],
  },
  'luka-rental': {
    id: 'PROJECT 02 // FLEET & BOOKING SYSTEM',
    title: 'Luka Rent a Car — Reservation Platform',
    metric: 'Real-Time Booking • Mobile-First Flow • SEO Optimized',
    summary:
      'High-speed vehicle reservation engine and fleet showcase with real-time booking availability, instant reservations, and a smooth mobile experience.',
    liveUrl: 'https://lukarentacar.com',
    stack: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Booking Engine'],
  },
  'haneul-b2b': {
    id: 'PROJECT 03 // B2B E-COMMERCE & CATALOG',
    title: 'Haneul — B2B Distribution Platform',
    metric: 'Fast Product Catalog • B2B Ordering • Modern UI',
    summary:
      'High-performance B2B distribution platform and interactive digital catalog engineered for speed, clarity, and seamless wholesale ordering.',
    liveUrl: 'https://haneul.blackbear-solutions.com/',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'B2B Architecture'],
  },
};

function initPortfolioFilterAndModal() {
  const filterBtns = document.querySelectorAll('.work-filter-btn');
  const projectItems = document.querySelectorAll('.work-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter') || 'all';
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      projectItems.forEach((item) => {
        const cat = item.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  const modal = document.getElementById('case-study-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalLiveLink = document.getElementById('modal-live-link');
  const triggers = document.querySelectorAll('[data-project-id]');

  function openModal(id) {
    const data = WORKS_DB[id];
    if (!data || !modal) return;

    document.getElementById('modal-prj-id').textContent = data.id;
    document.getElementById('modal-prj-title').textContent = data.title;
    document.getElementById('modal-prj-metric').textContent = data.metric;
    document.getElementById('modal-prj-summary').textContent = data.summary;

    if (modalLiveLink && data.liveUrl) {
      modalLiveLink.href = data.liveUrl;
    }

    const stackEl = document.getElementById('modal-prj-stack');
    if (stackEl) {
      stackEl.innerHTML = data.stack
        .map(
          (s) =>
            `<span class="px-3 py-1 text-xs font-mono-tech rounded-full bg-zinc-900 border border-white/10 text-zinc-300">${s}</span>`
        )
        .join('');
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  triggers.forEach((t) => {
    t.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const id = t.getAttribute('data-project-id');
      if (id) openModal(id);
    });
  });

  const modalInquireCta = document.getElementById('modal-inquire-cta');
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  modalInquireCta?.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   10. Contact Form & One-Click Email Copy
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('aleis-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const submitText = document.getElementById('contact-submit-text');
  const successBanner = document.getElementById('contact-success-banner');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailLabel = document.getElementById('copy-email-label');

  copyEmailBtn?.addEventListener('click', () => {
    navigator.clipboard?.writeText('contact@aleis.tech').catch(() => {});
    if (copyEmailLabel) {
      const original = copyEmailLabel.textContent;
      copyEmailLabel.textContent = 'COPIED ✓';
      copyEmailLabel.classList.add('text-cyan-400');
      setTimeout(() => {
        copyEmailLabel.textContent = original;
        copyEmailLabel.classList.remove('text-cyan-400');
      }, 2000);
    }
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!submitBtn || !submitText) return;

    const nameVal = document.getElementById('contact-name')?.value?.trim() || 'Friend';

    submitBtn.disabled = true;
    submitText.textContent = 'Sending Message...';

    setTimeout(() => {
      submitText.textContent = 'Message Sent ✓';
      submitBtn.classList.remove('bg-white', 'text-zinc-950');
      submitBtn.classList.add('bg-cyan-400', 'text-zinc-950');

      if (successBanner) {
        const msgEl = document.getElementById('contact-success-detail');
        if (msgEl) {
          msgEl.textContent = `Thanks, ${nameVal}! We received your message and will get back to you within 12 hours.`;
        }
        successBanner.classList.remove('hidden');
      }

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        submitBtn.classList.add('bg-white', 'text-zinc-950');
        submitBtn.classList.remove('bg-cyan-400');
      }, 3800);
    }, 600);
  });
}

/* ==========================================================================
   11. Real-Time Dynamic Animated Tab Favicon (Only active on desktop)
   ========================================================================== */
function initAnimatedFavicon() {
  if (window.innerWidth < 768) return;

  const faviconLink = document.getElementById('dynamic-favicon') || document.querySelector("link[rel*='icon']");
  if (!faviconLink) return;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let step = 0;

  function renderFavicon() {
    if (document.hidden) return;
    step += 0.22;
    ctx.clearRect(0, 0, 32, 32);

    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0.5, 0.5, 31, 31, 7.5);
    } else {
      ctx.rect(0.5, 0.5, 31, 31);
    }
    ctx.fillStyle = '#08090e';
    ctx.fill();

    const borderGrad = ctx.createLinearGradient(0, 0, 32, 32);
    borderGrad.addColorStop(0, '#00f0ff');
    borderGrad.addColorStop(0.5, '#3b82f6');
    borderGrad.addColorStop(1, '#8b5cf6');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    const auraAlpha = 0.16 + 0.1 * Math.sin(step);
    ctx.beginPath();
    ctx.arc(13, 16, 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${auraAlpha})`;
    ctx.fill();

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(7, 24);
    ctx.lineTo(13, 8);
    ctx.lineTo(19, 24);
    ctx.lineTo(15.8, 24);
    ctx.lineTo(14.6, 20.5);
    ctx.lineTo(11.4, 20.5);
    ctx.lineTo(10.2, 24);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#08090e';
    ctx.beginPath();
    ctx.moveTo(13, 13);
    ctx.lineTo(14.1, 17.5);
    ctx.lineTo(11.9, 17.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const bar1H = 6 + 5 * Math.sin(step * 1.4);
    const bar2H = 12 + 6 * Math.cos(step * 1.8);
    const bar3H = 8 + 5 * Math.sin(step * 1.2 + 1.2);

    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(22, 24 - bar1H, 1.8, bar1H);

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(25, 24 - bar2H, 1.8, bar2H);

    ctx.fillStyle = '#8b5cf6';
    ctx.fillRect(28, 24 - bar3H, 1.8, bar3H);

    try {
      faviconLink.href = canvas.toDataURL('image/png');
    } catch (_) {}
  }

  setInterval(renderFavicon, 350);
}
