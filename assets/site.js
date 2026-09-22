// Fresh visits start at the introduction, even with an old section anchor.
const sectionAnchors = new Set(['#top', '#work', '#experience', '#motorsport', '#contact', '#about']);
const startsAtTop = !location.hash || sectionAnchors.has(location.hash);
if (startsAtTop) {
  history.scrollRestoration = 'manual';
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  window.addEventListener('pageshow', () => {
    window.scrollTo({top: 0, left: 0, behavior: 'instant'});
  }, {once: true});
}

// Navigate within the page without saving a section-specific entry URL.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  if (!sectionAnchors.has(link.hash)) return;
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
    if (link.classList.contains('skip-link')) {
      target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
    }
  });
});

const dialog = document.getElementById('project-dialog');
const content = document.getElementById('dialog-content');
let opener;
if (typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-project]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const detail = document.getElementById(`detail-${link.dataset.project}`);
    if (!detail) return;
    event.preventDefault();
    opener = link;
    const clone = detail.cloneNode(true);
    clone.removeAttribute('id');
    clone.removeAttribute('aria-labelledby');
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    clone.querySelector('.detail-back').remove();
    content.replaceChildren(clone);
    dialog.setAttribute('aria-label', detail.querySelector('h2').textContent);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('modal-open');
  }));
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    opener?.focus({preventScroll: true});
  });
}
const sectionLinks = document.querySelectorAll('.side-nav a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) sectionLinks.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, {rootMargin: '-10% 0px -60% 0px'});
['work', 'experience', 'motorsport', 'contact'].forEach(id => observer.observe(document.getElementById(id)));
