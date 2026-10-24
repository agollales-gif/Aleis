/**
 * ALEIS — Digital Engineering & Creative Studio
 * High-Animation Interactive Engine:
 * 1. Cinematic Boot Preloader
 * 2. Hero Harmonic Wave + Interactive Particle Field Canvas
 * 3. 3D Perspective Tilt Cards & Specular Spotlight Tracking
 * 4. Dual-Ring Magnetic Cursor & [data-magnetic] Physics
 * 5. GSAP + ScrollTrigger Staggered Animations & Counters
 * 6. Works Filter, Case Study Modal & Contact Form
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initLiveTelemetryClock();
  initHeroHarmonicCanvas();
  initCustomCursorAndSpotlights();
  init3DTiltCards();
  initMagneticElements();
  initNavbarAndMobileMenu();
  initGsapAndScrollAnimations();
  initPortfolioFilterAndModal();
  initContactForm();
  initAnimatedFavicon();
});

/* ==========================================================================
   1. Cinematic Boot Preloader
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('aleis-preloader');
  const counterEl = document.getElementById('preloader-counter');
  const barEl = document.getElementById('preloader-bar');
  if (!preloader) return;

  let progress = 0;
  const duration = 850;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    progress = Math.min(100, Math.floor((elapsed / duration) * 100));
    if (counterEl) counterEl.textContent = `${progress}%`;
    if (barEl) barEl.style.width = `${progress}%`;

    if (progress < 100) {
      requestAnimationFrame(step);
    } else {
      setTimeout(() => {
        preloader.classList.add('is-loaded');
      }, 150);
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

  // Instant timezone-based location detection (zero latency & offline-ready)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const tzParts = tz.split('/');
  const city = (tzParts[tzParts.length - 1] || 'LOCAL').replace(/_/g, ' ');
  const region = tzParts.length > 1 ? tzParts[0] : '';
  let detectedPlace = region ? `${city}, ${region}` : city;

  if (footerLocationEl) {
    footerLocationEl.textContent = detectedPlace;
  }

  // Optional IP-based Country + City enrichment
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
    .catch(() => {
      // Keep timezone-derived location on offline or blocked network
    });

  function updateClocks() {
    const now = new Date();
    const localTimeStr = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // Calculate UTC offset label (e.g., GMT+2)
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

  let width = 0;
  let height = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let time = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  const particles = Array.from({ length: 36 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() * 1.8 + 0.6,
    vx: (Math.random() - 0.5) * 0.0004,
    vy: (Math.random() - 0.5) * 0.0004,
    alpha: Math.random() * 0.45 + 0.15,
  }));

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener(
    'mousemove',
    (e) => {
      targetMouseX = e.clientX / Math.max(window.innerWidth, 1);
      targetMouseY = e.clientY / Math.max(window.innerHeight, 1);
    },
    { passive: true }
  );

  const waves = [
    { color: 'rgba(0, 240, 255, 0.26)', amp: 42, freq: 0.0045, speed: 0.022, offset: 0 },
    { color: 'rgba(59, 130, 246, 0.22)', amp: 56, freq: 0.0035, speed: 0.016, offset: 1.8 },
    { color: 'rgba(99, 102, 241, 0.18)', amp: 34, freq: 0.0055, speed: 0.026, offset: 3.4 },
    { color: 'rgba(139, 92, 246, 0.16)', amp: 68, freq: 0.0028, speed: 0.013, offset: 5.1 },
  ];

  function render() {
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

      const px = p.x * width + (mouseX - 0.5) * 30;
      const py = p.y * height + (mouseY - 0.5) * 30;

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
      ctx.fill();
    });

    const centerY = height * 0.52 + (mouseY - 0.5) * 55;

    waves.forEach((w) => {
      ctx.beginPath();
      ctx.strokeStyle = w.color;
      ctx.lineWidth = 1.5;

      for (let x = 0; x <= width; x += 6) {
        const distFromMouse = Math.abs(x / width - mouseX);
        const mouseBoost = Math.max(0, 1 - distFromMouse * 2.6) * 38;
        const y =
          centerY +
          Math.sin(x * w.freq + time * w.speed + w.offset) * (w.amp + mouseBoost) +
          Math.cos(x * w.freq * 1.6 - time * w.speed * 0.7) * (w.amp * 0.35);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

/* ==========================================================================
   4. Custom Dual-Layer Magnetic Cursor & Spotlight Tracking
   ========================================================================== */
function initCustomCursorAndSpotlights() {
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

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${mouseX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${mouseY - rect.top}px`);
      });
    },
    { passive: true }
  );

  if (cursorRing && window.matchMedia('(pointer: fine)').matches) {
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
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   6. Magnetic Buttons & Links ([data-magnetic])
   ========================================================================== */
function initMagneticElements() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const magnetics = document.querySelectorAll('[data-magnetic]');
  magnetics.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate3d(${x * 0.24}px, ${y * 0.28}px, 0)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0px, 0px, 0)';
    });
  });
}

/* ==========================================================================
   7. Responsive Navbar & Mobile Menu Drawer
   ========================================================================== */
function initNavbarAndMobileMenu() {
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.desktop-nav-link');
  const sections = document.querySelectorAll('section[id]');

  let isMenuOpen = false;

  function toggleMenu(forceState) {
    isMenuOpen = typeof forceState === 'boolean' ? forceState : !isMenuOpen;
    if (!mobileMenu || !mobileToggle) return;

    mobileToggle.setAttribute('aria-expanded', String(isMenuOpen));

    if (isMenuOpen) {
      mobileMenu.classList.remove('hidden');
      requestAnimationFrame(() => {
        mobileMenu.classList.remove('opacity-0', '-translate-y-2');
        mobileMenu.classList.add('opacity-100', 'translate-y-0');
      });
      menuIconOpen?.classList.add('hidden');
      menuIconClose?.classList.remove('hidden');
    } else {
      mobileMenu.classList.remove('opacity-100', 'translate-y-0');
      mobileMenu.classList.add('opacity-0', '-translate-y-2');
      menuIconOpen?.classList.remove('hidden');
      menuIconClose?.classList.add('hidden');
      setTimeout(() => {
        if (!isMenuOpen) mobileMenu.classList.add('hidden');
      }, 220);
    }
  }

  mobileToggle?.addEventListener('click', () => toggleMenu());
  mobileLinks.forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) toggleMenu(false);
  });

  window.addEventListener(
    'scroll',
    () => {
      const scrollY = window.scrollY;
      if (header) {
        if (scrollY > 30) {
          header.classList.add('bg-[#050507]/90', 'shadow-2xl', 'shadow-black/80');
          header.classList.remove('bg-[#050507]/65');
        } else {
          header.classList.remove('bg-[#050507]/90', 'shadow-2xl', 'shadow-black/80');
          header.classList.add('bg-[#050507]/65');
        }
      }

      let currentSection = '';
      sections.forEach((section) => {
        const top = section.offsetTop - 200;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSection = section.getAttribute('id') || '';
        }
      });

      navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (currentSection && href === `#${currentSection}`) {
          link.classList.add('text-white', 'bg-white/10');
          link.classList.remove('text-zinc-400');
        } else {
          link.classList.remove('text-white', 'bg-white/10');
          link.classList.add('text-zinc-400');
        }
      });
    },
    { passive: true }
  );
}

/* ==========================================================================
   8. GSAP + ScrollTrigger Animations, Progress Bars & Counters
   ========================================================================== */
function initGsapAndScrollAnimations() {
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  if (hasGsap) {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const revealEls = document.querySelectorAll('.gs-reveal');
    revealEls.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 45, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    const parallaxEls = document.querySelectorAll('[data-parallax-y]');
    parallaxEls.forEach((el) => {
      const yOffset = parseFloat(el.getAttribute('data-parallax-y') || '-24');
      gsap.to(el, {
        y: yOffset,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  } else {
    const revealEls = document.querySelectorAll('.gs-reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transition = 'opacity 0.75s ease, transform 0.75s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => obs.observe(el));
  }

  // Animated Counters
  const counters = document.querySelectorAll('[data-counter-target]');
  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-counter-target') || '0');
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    const duration = 1700;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
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
    { threshold: 0.35 }
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
            `<span class="px-3 py-1 text-xs font-mono-tech rounded-full bg-zinc-900 border border-white/10 text-zinc-200">${s}</span>`
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
      // Allow direct external links inside cards to open normally
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
    navigator.clipboard?.writeText('agollales@gmail.com').catch(() => {});
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
    }, 700);
  });
}

/* ==========================================================================
   11. Real-Time Dynamic Animated Tab Favicon
   ========================================================================== */
function initAnimatedFavicon() {
  const faviconLink = document.getElementById('dynamic-favicon') || document.querySelector("link[rel*='icon']");
  if (!faviconLink) return;

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let step = 0;
  let interval = null;

  function renderFavicon() {
    step += 0.22;
    ctx.clearRect(0, 0, 32, 32);

    // 1. Dark squircle background
    ctx.save();
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0.5, 0.5, 31, 31, 7.5);
    } else {
      ctx.rect(0.5, 0.5, 31, 31);
    }
    ctx.fillStyle = '#08090e';
    ctx.fill();

    // 2. Glowing animated gradient border
    const borderGrad = ctx.createLinearGradient(0, 0, 32, 32);
    borderGrad.addColorStop(0, '#00f0ff');
    borderGrad.addColorStop(0.5, '#3b82f6');
    borderGrad.addColorStop(1, '#8b5cf6');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    // 3. Glowing cyan aura behind monogram
    const auraAlpha = 0.16 + 0.1 * Math.sin(step);
    ctx.beginPath();
    ctx.arc(13, 16, 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 240, 255, ${auraAlpha})`;
    ctx.fill();

    // 4. Sharp geometric "A" monogram
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(5.5, 25.5);
    ctx.lineTo(11.8, 7);
    ctx.lineTo(14.8, 7);
    ctx.lineTo(21.2, 25.5);
    ctx.lineTo(17.8, 25.5);
    ctx.lineTo(16.3, 20.8);
    ctx.lineTo(10.5, 20.8);
    ctx.lineTo(9, 25.5);
    ctx.closePath();
    ctx.fill();

    // Inner cutout for A
    ctx.beginPath();
    ctx.moveTo(11.4, 17.5);
    ctx.lineTo(15.4, 17.5);
    ctx.lineTo(13.3, 11.2);
    ctx.closePath();
    ctx.fillStyle = '#08090e';
    ctx.fill();
    ctx.restore();

    // 5. Bouncing equalizer soundwave bars
    const h1 = 4.5 + 6.5 * Math.abs(Math.sin(step * 1.1));
    const h2 = 6.5 + 11.5 * Math.abs(Math.sin(step * 1.45 + 0.6));
    const h3 = 4.0 + 8.5 * Math.abs(Math.sin(step * 0.95 + 1.3));

    // Bar 1 (Electric Cyan)
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(22.5, 25.5 - h1, 2, h1);

    // Bar 2 (Sky Blue)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(25.5, 25.5 - h2, 2, h2);

    // Bar 3 (Indigo)
    ctx.fillStyle = '#818cf8';
    ctx.fillRect(28.5, 25.5 - h3, 2, h3);

    // Update tab icon
    faviconLink.href = canvas.toDataURL('image/png');
  }

  function start() {
    if (!interval) {
      interval = setInterval(renderFavicon, 85);
    }
  }

  function stop() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
}
