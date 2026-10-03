(() => {
  const body = document.body;
  const assets = Array.isArray(window.NIHAR_ARCHIVE) ? window.NIHAR_ARCHIVE : [];
  const itemsRoot = document.querySelector('#archive-items');
  const filtersRoot = document.querySelector('#archive-filters');
  const searchInput = document.querySelector('#archive-search');
  const emptyState = document.querySelector('#archive-empty');
  const counts = { all: document.querySelector('#asset-count'), image: document.querySelector('#image-count'), pdf: document.querySelector('#pdf-count') };
  let activeFilter = 'all';

  const prettyCategory = (value) => value.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  counts.all.textContent = assets.length;
  counts.image.textContent = assets.filter((item) => item.type === 'image').length;
  counts.pdf.textContent = assets.filter((item) => item.type === 'pdf').length;
  const categories = [...new Set(assets.map((item) => item.category))].sort();
  const makeFilter = (value, label) => `<button class="archive-filter${value === 'all' ? ' active' : ''}" type="button" data-filter="${escapeHTML(value)}" aria-pressed="${value === 'all'}">${escapeHTML(label)}</button>`;
  filtersRoot.innerHTML = [makeFilter('all', 'All files'), makeFilter('image', 'Images'), makeFilter('pdf', 'PDFs'), ...categories.map((category) => makeFilter(`folder:${category}`, prettyCategory(category)))].join('');

  const render = () => {
    const query = (searchInput.value || '').trim().toLowerCase();
    const visible = assets.filter((item) => {
      const filterMatch = activeFilter === 'all' || activeFilter === item.type || activeFilter === `folder:${item.category}`;
      const searchMatch = !query || `${item.title} ${item.category} ${item.source}`.toLowerCase().includes(query);
      return filterMatch && searchMatch;
    });
    itemsRoot.innerHTML = visible.map((item) => {
      const title = escapeHTML(item.title);
      const category = escapeHTML(prettyCategory(item.category));
      if (item.type === 'pdf') return `<article class="archive-card"><a class="pdf-card" href="${item.path}" target="_blank" rel="noopener" aria-label="Open PDF ${title}"><iframe class="pdf-preview" src="${item.path}#page=1&view=FitH" title="Preview of ${title}" loading="lazy"></iframe><span class="pdf-card-footer"><span class="pdf-mark">PDF</span><span class="pdf-card-label">${title}<br /><small>${category} / open document \u2197</small></span></span></a></article>`;
      return `<article class="archive-card"><button class="archive-card-media" type="button" data-full="${item.path}" data-title="${title}" aria-label="Open ${title}"><img src="${item.path}" alt="${title}" loading="lazy" decoding="async" /></button><div class="archive-card-meta"><span class="archive-card-title">${title}</span><span class="archive-card-category">${category}</span></div></article>`;
    }).join('');
    emptyState.hidden = visible.length !== 0;
    itemsRoot.querySelectorAll('[data-full]').forEach((button) => button.addEventListener('click', () => openLightbox(button.dataset.full, button.dataset.title)));
  };
  filtersRoot.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    activeFilter = button.dataset.filter;
    filtersRoot.querySelectorAll('[data-filter]').forEach((item) => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    render();
  });
  searchInput.addEventListener('input', render);

  const themeToggle = document.querySelector('.theme-toggle');
  const themeLabel = document.querySelector('.theme-label');
  const themeIcon = document.querySelector('.theme-icon');
  const syncTheme = () => { const light = body.dataset.theme === 'light'; themeToggle.setAttribute('aria-pressed', String(light)); themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode'); themeLabel.textContent = light ? 'Dark mode' : 'Light mode'; themeIcon.textContent = light ? '\u25d1' : '\u25d0'; };
  syncTheme();
  themeToggle.addEventListener('click', () => { if (body.dataset.theme === 'light') delete body.dataset.theme; else body.dataset.theme = 'light'; syncTheme(); });

  const lightbox = document.querySelector('#archive-lightbox');
  const lightboxImage = document.querySelector('#archive-lightbox-image');
  const lightboxTitle = document.querySelector('#archive-lightbox-title');
  const closeLightbox = () => { lightbox.hidden = true; body.classList.remove('lightbox-open'); };
  const openLightbox = (src, title) => { lightboxImage.src = src; lightboxImage.alt = title; lightboxTitle.textContent = title; lightbox.hidden = false; body.classList.add('lightbox-open'); document.querySelector('.archive-lightbox-close').focus(); };
  document.querySelector('.archive-lightbox-close').addEventListener('click', closeLightbox);
  document.querySelector('.archive-lightbox-backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !lightbox.hidden) closeLightbox(); });

  document.querySelectorAll('[data-transition]').forEach((link) => link.addEventListener('click', (event) => { const href = link.getAttribute('href'); if (!href || href.startsWith('#') || event.metaKey || event.ctrlKey) return; event.preventDefault(); body.classList.add('page-exit'); window.setTimeout(() => { window.location.href = href; }, 620); }));
  render();
  requestAnimationFrame(() => requestAnimationFrame(() => body.classList.add('page-ready')));
})();

