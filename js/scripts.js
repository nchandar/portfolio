window.addEventListener('DOMContentLoaded', () => {
  const revealTargets = document.querySelectorAll(
    'section, .card, .timeline-item, .skill-groups > div, .patent'
  );

  revealTargets.forEach((el, index) => {
    if (!el.classList.contains('hero')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(index * 22, 240)}ms`;
    }
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => {
    if (!el.classList.contains('hero')) {
      observer.observe(el);
    }
  });

  const copyEmailButton = document.querySelector('.copy-icon[data-copy-email]');
  if (copyEmailButton) {
    copyEmailButton.addEventListener('click', async () => {
      const email = copyEmailButton.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(email);
        copyEmailButton.classList.add('is-copied');
        copyEmailButton.setAttribute('aria-label', 'Email copied');
        setTimeout(() => {
          copyEmailButton.classList.remove('is-copied');
          copyEmailButton.setAttribute('aria-label', 'Copy email');
        }, 1400);
      } catch (err) {
        copyEmailButton.setAttribute('aria-label', 'Copy failed');
        setTimeout(() => {
          copyEmailButton.setAttribute('aria-label', 'Copy email');
        }, 1400);
      }
    });
  }
});
