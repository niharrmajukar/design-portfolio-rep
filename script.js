(() => {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const themeIcon = document.querySelector('.theme-icon');
  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  body.classList.add('js-enabled');
  const heroTypingTitle = document.querySelector('#hero-typing-title');
  if (heroTypingTitle && !reduceMotion) {
    const heroTypingText = heroTypingTitle.dataset.text || 'MJKR_NIHAAR';
    heroTypingTitle.textContent = '';
    [...heroTypingText].forEach((character, index) => {
      window.setTimeout(() => { heroTypingTitle.textContent += character; }, 90 * index + 260);
    });
  }
  const syncThemeControl = () => {
    const isLight = body.dataset.theme === 'light';
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    if (themeLabel) themeLabel.textContent = isLight ? 'Dark mode' : 'Light mode';
    if (themeIcon) themeIcon.textContent = isLight ? '\u25d1' : '\u25d0';
  };
  syncThemeControl();
  themeToggle?.addEventListener('click', () => {
    const nextTheme = body.dataset.theme === 'light' ? 'dark' : 'light';
    if (nextTheme === 'light') body.dataset.theme = 'light'; else delete body.dataset.theme;
    syncThemeControl();
  });

  window.requestAnimationFrame(() => window.requestAnimationFrame(() => body.classList.add('page-ready')));

  const observer = reduceMotion ? null : new IntersectionObserver((entries, io) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('video').forEach((video) => video.play().catch(() => {}));
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealItems.forEach((item) => {
    if (reduceMotion) item.classList.add('is-visible'); else observer.observe(item);
  });

  const filterButtons = document.querySelectorAll('.filter-button');
  const filterItems = document.querySelectorAll('.project-card[data-category], .archive-tile[data-category]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach((item) => {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });
      filterItems.forEach((item) => {
        const visible = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('is-filtered', !visible);
        if (visible) item.classList.remove('is-hidden-by-filter');
      });
    });
  });
  filterButtons[0]?.setAttribute('aria-pressed', 'true');

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxTitle = document.querySelector('#lightbox-title');
  const lightboxCounter = document.querySelector('#lightbox-counter');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
  const lightboxItems = [...document.querySelectorAll('[data-lightbox]')];
  let activeLightboxIndex = 0;
  let lastFocusedElement = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    body.classList.remove('lightbox-open');
    lastFocusedElement?.focus();
  };
  const showLightboxItem = (index) => {
    if (!lightbox || !lightboxItems.length) return;
    activeLightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    const item = lightboxItems[activeLightboxIndex];
    lightboxImage.src = item.dataset.lightbox;
    lightboxImage.alt = item.alt;
    lightboxTitle.textContent = item.dataset.lightboxTitle || item.alt;
    lightboxCounter.textContent = `${String(activeLightboxIndex + 1).padStart(2, '0')} / ${String(lightboxItems.length).padStart(2, '0')}`;
  };
  const openLightbox = (item) => {
    lastFocusedElement = item;
    showLightboxItem(lightboxItems.indexOf(item));
    lightbox.hidden = false;
    body.classList.add('lightbox-open');
    lightboxClose?.focus();
  };
  lightboxItems.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(item); }
    });
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowRight') showLightboxItem(activeLightboxIndex + 1);
    if (event.key === 'ArrowLeft') showLightboxItem(activeLightboxIndex - 1);
  });
  let lightboxTouchStartX = 0;
  lightbox?.addEventListener('touchstart', (event) => { lightboxTouchStartX = event.changedTouches[0].screenX; }, { passive: true });
  lightbox?.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].screenX - lightboxTouchStartX;
    if (Math.abs(distance) < 48) return;
    showLightboxItem(activeLightboxIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  const halo = document.querySelector('.cursor-halo');
  if (halo && window.matchMedia('(pointer:fine)').matches && !reduceMotion) {
    window.addEventListener('pointermove', (event) => {
      halo.style.left = `${event.clientX}px`; halo.style.top = `${event.clientY}px`; halo.style.opacity = '1';
    }, { passive: true });
    document.querySelectorAll('a, button, .project-card, .archive-tile, [data-lightbox]').forEach((item) => {
      item.addEventListener('mouseenter', () => { halo.style.width = '3rem'; halo.style.height = '3rem'; });
      item.addEventListener('mouseleave', () => { halo.style.width = '1.5rem'; halo.style.height = '1.5rem'; });
    });
  }

  const projectModal = document.querySelector('#project-modal');
  const projectModalImage = document.querySelector('#project-modal-image');
  const projectModalTitle = document.querySelector('#project-modal-title');
  const projectModalCategory = document.querySelector('#project-modal-category');
  const projectModalDescription = document.querySelector('#project-modal-description');
  const projectModalTag = document.querySelector('#project-modal-tag');
  const projectModalClose = document.querySelector('.project-modal-close');
  const projectModalBackdrop = document.querySelector('.project-modal-backdrop');
  let lastProjectCard = null;
  const closeProjectModal = () => { if (!projectModal) return; projectModal.hidden = true; body.classList.remove('project-modal-open'); lastProjectCard?.focus(); };
  const openProjectModal = (card) => {
    if (!projectModal) return;
    lastProjectCard = card;
    const title = card.querySelector('h3')?.textContent.trim() || 'Project details';
    const category = card.querySelector('.eyebrow')?.textContent.trim() || '';
    const description = card.querySelector('.project-description')?.textContent.trim() || '';
    const tag = card.querySelector('.project-tag')?.textContent.trim() || '';
    const image = card.querySelector('.project-image img');
    projectModalTitle.textContent = title;
    projectModalCategory.textContent = category;
    projectModalDescription.textContent = description;
    projectModalTag.textContent = tag;
    projectModalImage.src = image?.dataset.lightbox || image?.src || '';
    projectModalImage.alt = image?.alt || title;
    projectModal.hidden = false;
    body.classList.add('project-modal-open');
    projectModalClose?.focus();
  };
  document.querySelectorAll('.project-card').forEach((card) => {
    const title = card.querySelector('h3')?.textContent.trim() || 'project';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View project details: ${title}`);
    card.addEventListener('click', (event) => { if (event.target.closest('[data-lightbox]')) return; openProjectModal(card); });
    card.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProjectModal(card); } });
  });
  projectModalClose?.addEventListener('click', closeProjectModal);
  projectModalBackdrop?.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && projectModal && !projectModal.hidden) closeProjectModal(); });
  document.querySelectorAll('video').forEach((video) => {
    video.addEventListener('click', () => { if (video.paused) video.play(); else video.pause(); });
  });

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const data = new FormData(form);
      const subject = `Portfolio enquiry from ${data.get('name') || 'a visitor'}`;
      const bodyText = `Name: ${data.get('name') || ''}\nEmail: ${data.get('email') || ''}\n\nMessage:\n${data.get('message') || ''}`;
      if (status) { status.hidden = false; status.textContent = 'Your email app is opening with your note addressed to Nihar.'; }
      window.location.href = `mailto:niharmajukar59@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      form.reset();
    });
  });

  document.querySelectorAll('[data-transition]').forEach((link) => link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    body.classList.add('page-exit');
    window.setTimeout(() => { window.location.href = href; }, 620);
  }));
})();


