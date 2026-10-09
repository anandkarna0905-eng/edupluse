/* EduWatch visual micro-interactions. Optional GSAP enhancement; app logic stays in its original files. */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsapReady = !reduceMotion && window.gsap;

  function animateIn(selector, options = {}) {
    if (!gsapReady) return;
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;
    window.gsap.fromTo(elements,
      { y: options.y ?? 12, opacity: 0 },
      { y: 0, opacity: 1, duration: options.duration ?? 0.48, stagger: options.stagger ?? 0.055, ease: 'power2.out', clearProps: 'transform' }
    );
  }

  function animateVisibleWorkspace() {
    if (!gsapReady) return;
    const landing = document.querySelector('#landingPage');
    const login = document.querySelector('#loginPage');
    const faculty = document.querySelector('#facultyWorkspace');
    const student = document.querySelector('#studentWorkspace');
    if (landing && !landing.classList.contains('d-none')) {
      animateIn('.landing-nav, .hero-copy > *, .hero-visual, .landing-features > div', { y: 16, stagger: 0.07 });
    } else if (login && !login.classList.contains('d-none')) {
      animateIn('.login-card > *', { y: 10, stagger: 0.045, duration: 0.35 });
    } else if (faculty && !faculty.classList.contains('d-none')) {
      animateIn('.topbar, #dashboardView .welcome-panel, #dashboardView .stat-card, #dashboardView .panel', { y: 12, stagger: 0.045 });
    } else if (student && !student.classList.contains('d-none')) {
      animateIn('.student-welcome, .student-metric, .student-panel', { y: 12, stagger: 0.055 });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    animateVisibleWorkspace();

    // Observe the existing login flow's visibility changes without changing its behavior.
    const observer = new MutationObserver(() => {
      window.requestAnimationFrame(animateVisibleWorkspace);
    });
    ['#landingPage', '#loginPage', '#facultyWorkspace', '#studentWorkspace'].forEach(selector => {
      const element = document.querySelector(selector);
      if (element) observer.observe(element, { attributes: true, attributeFilter: ['class'] });
    });

    // Small button press feedback; no API or form handlers are replaced.
    document.addEventListener('pointerdown', event => {
      const button = event.target.closest('button.btn-primary, .role-card, .table-action');
      if (!button || reduceMotion) return;
      if (gsapReady) window.gsap.to(button, { scale: 0.985, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    }, { passive: true });
  });
})();
