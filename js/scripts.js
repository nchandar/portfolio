window.addEventListener('DOMContentLoaded', () => {
  const themeToggleButton = document.querySelector('.theme-toggle');
  const themeIcon = themeToggleButton ? themeToggleButton.querySelector('i') : null;
  const profilePhoto = document.querySelector('.profile-photo');
  const themeStorageKey = 'portfolio-theme';
  let profileSwapTimerId = null;

  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const getCurrentTheme = () =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  const getProfileSrcForTheme = (theme) => {
    if (!profilePhoto) {
      return null;
    }
    return theme === 'dark' ? profilePhoto.dataset.darkSrc : profilePhoto.dataset.lightSrc;
  };

  const getProfileFallbackSrc = () =>
    profilePhoto ? profilePhoto.dataset.fallbackSrc || 'assets/img/profile.jpg' : null;

  const swapProfileImage = (theme, shouldAnimate) => {
    if (!profilePhoto) {
      return;
    }

    const nextSrc = getProfileSrcForTheme(theme);
    const fallbackSrc = getProfileFallbackSrc();
    if (!nextSrc) {
      profilePhoto.src = fallbackSrc;
      return;
    }

    const currentImagePath = profilePhoto.getAttribute('src') || '';
    if (currentImagePath.endsWith(nextSrc)) {
      return;
    }

    const applyNextImage = () => {
      profilePhoto.src = nextSrc;
      profilePhoto.onerror = () => {
        if (profilePhoto.getAttribute('src') !== fallbackSrc) {
          profilePhoto.src = fallbackSrc;
        }
      };
    };

    if (!shouldAnimate) {
      applyNextImage();
      return;
    }

    if (profileSwapTimerId) {
      clearTimeout(profileSwapTimerId);
      profileSwapTimerId = null;
    }

    profilePhoto.classList.remove('is-flipping');
    void profilePhoto.offsetWidth;
    profilePhoto.classList.add('is-flipping');
    profileSwapTimerId = setTimeout(() => {
      applyNextImage();
      profileSwapTimerId = null;
    }, 310);
  };

  const updateThemeButtonUi = (theme) => {
    if (!themeToggleButton || !themeIcon) {
      return;
    }
    const nextThemeLabel = theme === 'dark' ? 'light mode' : 'dark mode';
    themeToggleButton.setAttribute('aria-pressed', String(theme === 'dark'));
    themeToggleButton.setAttribute('aria-label', `Switch to ${nextThemeLabel}`);
    themeIcon.classList.remove('fa-sun', 'fa-moon');
    themeIcon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
  };

  const initialTheme = getCurrentTheme();
  updateThemeButtonUi(initialTheme);
  swapProfileImage(initialTheme, false);
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
      const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      updateThemeButtonUi(nextTheme);
      swapProfileImage(nextTheme, true);
      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch (err) {
        // Ignore storage failures in private mode or restricted contexts.
      }
    });
  }

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
