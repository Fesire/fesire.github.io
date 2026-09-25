(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  function updateThemeLabel() {
    const isLight = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
    themeColor.content = isLight ? '#ffffff' : '#000000';
  }
  themeButton.hidden = false;
  updateThemeLabel();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('fesire-theme', root.dataset.theme); } catch (_) { /* Storage is optional. */ }
    updateThemeLabel();
  });

  const filters = document.querySelector('.filters');
  const projects = [...document.querySelectorAll('.project')];
  const grid = document.querySelector('.project-grid');
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const category = button.dataset.filter;
    filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    projects.forEach(project => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) count++;
    });
    grid.classList.toggle('is-filtered', category !== 'all');
    document.querySelector('.work-count').textContent = String(count).padStart(2, '0');
    document.querySelector('#filter-status').textContent = `${count} projects shown. ${category === 'all' ? 'All work' : button.textContent.trim()}.`;
  });

  // Use a smaller cover or a typographic fallback if YouTube has no thumbnail.
  document.querySelectorAll('.project-image img').forEach(img => {
    function fallback() {
      if (img.dataset.fallback) {
        const nextSource = img.dataset.fallback;
        delete img.dataset.fallback;
        img.src = nextSource;
      } else {
        img.parentElement.classList.add('image-unavailable');
      }
    }
    img.addEventListener('error', fallback);
    function checkImage() {
      if (img.naturalWidth <= 120) { fallback(); return; }
      img.parentElement.classList.remove('image-unavailable');
      img.parentElement.classList.toggle('standard-thumbnail', img.naturalHeight / img.naturalWidth > 0.65);
    }
    img.addEventListener('load', checkImage);
    if (img.complete) checkImage();
  });

  const filmDialog = document.querySelector('#film-dialog');
  const contactDialog = document.querySelector('#contact-dialog');
  const playerContainer = document.querySelector('#player-container');
  const canShowDialogs = typeof filmDialog.showModal === 'function';
  let lastTrigger;
  function openDialog(dialog, trigger) {
    lastTrigger = trigger;
    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.querySelector('[data-close]').focus();
  }
  document.querySelectorAll('[data-video]').forEach(link => {
    link.addEventListener('click', event => {
      if (!canShowDialogs || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.querySelector('#film-title').textContent = link.dataset.title;
      document.querySelector('#film-kind').textContent = link.dataset.kind;
      document.querySelector('#youtube-link').href = link.href;
      const frame = document.createElement('iframe');
      frame.title = link.dataset.title;
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(link.dataset.video)}?autoplay=1&playsinline=1&rel=0`;
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      playerContainer.replaceChildren(frame);
      openDialog(filmDialog, link);
    });
  });
  document.querySelectorAll('[data-contact]').forEach(link => {
    link.addEventListener('click', event => {
      if (!canShowDialogs || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openDialog(contactDialog, link);
    });
  });
  [filmDialog, contactDialog].forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    let pointerStartedOutside = false;
    function isOutside(event) {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    }
    dialog.addEventListener('pointerdown', event => { pointerStartedOutside = event.target === dialog && isOutside(event); });
    dialog.addEventListener('click', event => {
      if (pointerStartedOutside && event.target === dialog && isOutside(event)) dialog.close();
      pointerStartedOutside = false;
    });
    dialog.addEventListener('close', () => {
      if (dialog === filmDialog) playerContainer.replaceChildren();
      document.body.classList.remove('modal-open');
      lastTrigger?.focus({ preventScroll: true });
    });
  });
})();
