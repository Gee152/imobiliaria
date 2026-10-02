// ==========================================================================
// SCROLL & PARALLAX MANAGER
// High-performance, 60fps luxury real estate animations with spring physics
// ==========================================================================

function initScrollSystem() {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ------------------------------------------------------------------------
  // 1. SCROLL REVEAL OBSERVER
  // ------------------------------------------------------------------------
  const revealSelector = '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-down, .scroll-reveal-up';

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    }
  );

  const observeElements = (container: Document | HTMLElement = document) => {
    const elements = container.querySelectorAll(revealSelector);
    elements.forEach((el) => {
      // If already in viewport on load, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30 && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  };

  // Initial observe
  observeElements();

  // Watch for dynamically rendered elements (React components like PropertyCatalog)
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          if (element.matches && element.matches(revealSelector)) {
            observeElements(element.parentElement || document);
          } else if (element.querySelectorAll) {
            const hasReveals = element.querySelectorAll(revealSelector).length > 0;
            if (hasReveals) {
              observeElements(element);
            }
          }
        }
      });
    });
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  });

  // ------------------------------------------------------------------------
  // 2. SMOOTH DYNAMIC NUMBER COUNTERS (RAF Easing)
  // ------------------------------------------------------------------------
  const countersAnimated = new Set<HTMLElement>();

  function runNumberCounters() {
    const counterElements = Array.from(document.querySelectorAll<HTMLElement>('[data-counter-target]'));

    const startCounter = (el: HTMLElement) => {
      if (countersAnimated.has(el)) return;
      countersAnimated.add(el);

      const targetValue = parseFloat(el.getAttribute('data-counter-target') || '0');
      if (isNaN(targetValue) || targetValue <= 0) return;

      const duration = prefersReducedMotion ? 1200 : 3900; // ms: +15% slower, gradual luxury counting
      let startTime: number | null = null;

      const animateCounter = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Gentle ease-out deceleration curve so increments are steadily observable throughout
        const easeOutProgress = 1 - Math.pow(1 - progress, 1.5);
        const currentNumber = Math.round(targetValue * easeOutProgress);

        el.textContent = currentNumber.toString();

        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        } else {
          el.textContent = targetValue.toString();
          if (!prefersReducedMotion) {
            el.classList.add('counter-finished');
          }
        }
      };

      requestAnimationFrame(animateCounter);
    };

    const counterInViewObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounter(entry.target as HTMLElement);
            counterInViewObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -20px 0px'
      }
    );

    counterElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30 && rect.bottom > 30) {
        setTimeout(() => startCounter(el), 350);
      } else {
        counterInViewObserver.observe(el);
      }
    });
  }

  // ------------------------------------------------------------------------
  // ------------------------------------------------------------------------
  // 3. CINEMATIC SCROLL UNLOCK & CONVERGENCE TRIGGER FOR HERO
  // ------------------------------------------------------------------------
  let isCinematicUnlocked = false;
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
  const heroElement = document.getElementById('hero');

  const isHeroInView = () => {
    if (!heroElement) return true;
    const rect = heroElement.getBoundingClientRect();
    return rect.top < window.innerHeight - 40 && rect.bottom > 40;
  };

  const triggerCinematicUnlock = () => {
    if (isCinematicUnlocked) return;
    isCinematicUnlocked = true;

    if (fallbackTimer) {
      clearTimeout(fallbackTimer);
      fallbackTimer = null;
    }

    document.documentElement.classList.add('cinematic-unlocked');
    document.body.classList.add('cinematic-unlocked');

    // Run dynamic number counters
    runNumberCounters();

    // Clean up one-time event listeners
    window.removeEventListener('scroll', checkFirstScroll);
    window.removeEventListener('wheel', checkFirstWheel);
    window.removeEventListener('touchmove', checkFirstTouch);
    window.removeEventListener('keydown', checkFirstKey);
  };

  const checkFirstScroll = () => {
    if (isHeroInView() && window.scrollY > 4) {
      triggerCinematicUnlock();
    }
  };

  const checkFirstWheel = (e: WheelEvent) => {
    if (isHeroInView() && Math.abs(e.deltaY) > 1) {
      triggerCinematicUnlock();
    }
  };

  const checkFirstTouch = () => {
    if (isHeroInView()) {
      triggerCinematicUnlock();
    }
  };

  const checkFirstKey = (e: KeyboardEvent) => {
    if (isHeroInView() && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space'].includes(e.code)) {
      triggerCinematicUnlock();
    }
  };

  // Listen for initial user intent when Hero is visible
  window.addEventListener('scroll', checkFirstScroll, { passive: true });
  window.addEventListener('wheel', checkFirstWheel, { passive: true });
  window.addEventListener('touchmove', checkFirstTouch, { passive: true });
  window.addEventListener('keydown', checkFirstKey, { passive: true });

  // If page was loaded with Hero already in view and scrolled down
  if (isHeroInView() && window.scrollY > 8) {
    triggerCinematicUnlock();
  }

  // Graceful fallback: If Hero is currently in view and stays idle for 3.5s, unlock smoothly
  fallbackTimer = setTimeout(() => {
    if (!isCinematicUnlocked && isHeroInView()) {
      triggerCinematicUnlock();
    }
  }, 3500);

  // Dedicated Hero IntersectionObserver: When Hero scrolls into view from ScrollStory, unlock immediately
  if (heroElement) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerCinematicUnlock();
            heroObserver.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.12
      }
    );
    heroObserver.observe(heroElement);
  }

  // Backup observer for counter elements in case of deep linking
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        triggerCinematicUnlock();
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-counter-target]').forEach((el) => {
    counterObserver.observe(el);
  });

  // ------------------------------------------------------------------------
  // 4. DEEP PARALLAX ENGINE (60fps RAF loop)
  // ------------------------------------------------------------------------
  if (!prefersReducedMotion) {
    let ticking = false;
    let parallaxElements: HTMLElement[] = [];

    const refreshParallaxElements = () => {
      parallaxElements = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    };

    refreshParallaxElements();

    const updateParallax = () => {
      const windowHeight = window.innerHeight;

      for (let i = 0; i < parallaxElements.length; i++) {
        const el = parallaxElements[i];
        const speedAttr = el.getAttribute('data-parallax');
        const speed = speedAttr ? parseFloat(speedAttr) : 0.1;
        const rect = el.getBoundingClientRect();

        // Only compute if within or near viewport
        if (rect.bottom >= -150 && rect.top <= windowHeight + 150) {
          const centerDelta = rect.top + rect.height / 2 - windowHeight / 2;
          const translateY = centerDelta * speed;
          el.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        }
      }

      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial update
    window.requestAnimationFrame(updateParallax);

    // Refresh elements list when DOM mutates
    window.addEventListener('resize', () => {
      refreshParallaxElements();
      window.requestAnimationFrame(updateParallax);
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 5. SMOOTH ANCHOR NAVIGATION
  // ------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        triggerCinematicUnlock();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize on DOMContentLoaded and Astro page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollSystem);
} else {
  initScrollSystem();
}

document.addEventListener('astro:page-load', initScrollSystem);
