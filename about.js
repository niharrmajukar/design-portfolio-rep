(() => {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const themeIcon = document.querySelector('.theme-icon');
  const title = document.querySelector('#typing-title');
  const text = title?.dataset.text || 'NIHAR MAJUKAR';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const syncTheme = () => {
    const light = body.dataset.theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(light));
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
    themeLabel.textContent = light ? 'Dark mode' : 'Light mode';
    themeIcon.textContent = light ? '\u25d1' : '\u25d0';
  };
  syncTheme();
  themeToggle.addEventListener('click', () => {
    if (body.dataset.theme === 'light') delete body.dataset.theme; else body.dataset.theme = 'light';
    syncTheme();
  });

  if (title && !reducedMotion) {
    title.textContent = '';
    [...text].forEach((character, index) => {
      window.setTimeout(() => { title.textContent += character; }, 90 * index + 220);
    });
  }
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
  const skillFilters = document.querySelectorAll('[data-skill-filter]');
  const skillRows = document.querySelectorAll('.skill-row[data-skill]');
  skillFilters.forEach((filterButton) => {
    filterButton.addEventListener('click', () => {
      const selected = filterButton.dataset.skillFilter;
      skillFilters.forEach((button) => {
        const active = button === filterButton;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
      skillRows.forEach((row) => {
        const visible = selected === 'all' || row.dataset.skill === selected;
        row.classList.toggle('is-hidden', !visible);
        if (visible) {
          const bar = row.querySelector('.skill-track span');
          if (bar) { bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = ''; }
        }
      });
    });
  });
  const processVideo = document.querySelector('#ipad-sketch-video');
  const videoSoundToggle = document.querySelector('[data-video-sound-toggle]');
  const videoSoundLabel = document.querySelector('[data-video-sound-label]');
  videoSoundToggle?.addEventListener('click', () => {
    if (!processVideo) return;
    processVideo.muted = !processVideo.muted;
    videoSoundToggle.setAttribute('aria-pressed', String(!processVideo.muted));
    videoSoundToggle.setAttribute('aria-label', processVideo.muted ? 'Unmute the iPad sketching video' : 'Mute the iPad sketching video');
    if (videoSoundLabel) videoSoundLabel.textContent = processVideo.muted ? 'Unmute video' : 'Mute video';
    processVideo.play().catch(() => {});
  });
  document.querySelectorAll('[data-transition]').forEach((link) => link.addEventListener('click', (event) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || event.metaKey || event.ctrlKey) return;
    event.preventDefault(); body.classList.add('page-exit'); window.setTimeout(() => { window.location.href = href; }, 620);
  }));
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('page-ready')));
})();

