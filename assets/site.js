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
