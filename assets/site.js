// Fresh visits start at the introduction, even with an old section anchor.
const sectionAnchors = new Set(['#top', '#work', '#motorsport', '#contact', '#about']);
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
['work', 'motorsport', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });

// image lightbox: click any project or motorsport photo to view it large, then zoom and pan
const zoomable = '.detail-hero img, .detail-gallery img, .motorsport-gallery img, .motorsport-photo img';
const box = document.createElement('dialog');
box.className = 'lightbox';
box.setAttribute('aria-label', 'Image viewer');
box.innerHTML = '<div class="lightbox-stage"><img alt=""></div>' +
  '<div class="lightbox-bar"><span class="lightbox-caption"></span><div class="lightbox-tools">' +
  '<button type="button" data-zoom="out" aria-label="Zoom out">−</button>' +
  '<button type="button" data-zoom="reset" aria-label="Reset zoom">Fit</button>' +
  '<button type="button" data-zoom="in" aria-label="Zoom in">+</button>' +
  '<button type="button" data-zoom="close" aria-label="Close image">Close</button></div></div>';
document.body.appendChild(box);
const stage = box.querySelector('.lightbox-stage');
const big = stage.querySelector('img');
const caption = box.querySelector('.lightbox-caption');
let scale = 1, tx = 0, ty = 0, lastOpener;
const pointers = new Map();
let pinchStart = null, dragStart = null, moved = false, downOnImage = false;

const apply = () => {
  big.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  stage.classList.toggle('is-zoomed', scale > 1);
};
const reset = () => { scale = 1; tx = 0; ty = 0; apply(); };
// zoom around a point given in stage coordinates
const zoomAt = (factor, cx, cy) => {
  const next = Math.min(8, Math.max(1, scale * factor));
  const r = stage.getBoundingClientRect();
  const px = cx - r.left - r.width / 2, py = cy - r.top - r.height / 2;
  tx = px - (px - tx) * (next / scale);
  ty = py - (py - ty) * (next / scale);
  scale = next;
  if (scale === 1) { tx = 0; ty = 0; }
  apply();
};
const zoomCenter = factor => {
  const r = stage.getBoundingClientRect();
  zoomAt(factor, r.left + r.width / 2, r.top + r.height / 2);
};

if (typeof box.showModal === 'function') {
  document.addEventListener('click', event => {
    const img = event.target.closest(zoomable);
    if (!img || event.metaKey || event.ctrlKey) return;
    lastOpener = img;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    const fig = img.closest('figure');
    caption.textContent = fig?.querySelector('figcaption, span')?.textContent || img.alt;
    reset();
    box.showModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const img = event.target.closest?.(zoomable);
    if (img) { event.preventDefault(); img.click(); }
  });
  document.querySelectorAll(zoomable).forEach(img => img.tabIndex = 0);
  new MutationObserver(() => document.querySelectorAll(`#dialog-content :is(${zoomable})`).forEach(img => img.tabIndex = 0))
    .observe(document.getElementById('dialog-content'), {childList: true});

  box.querySelector('.lightbox-tools').addEventListener('click', event => {
    const action = event.target.closest('button')?.dataset.zoom;
    if (action === 'in') zoomCenter(1.5);
    else if (action === 'out') zoomCenter(1 / 1.5);
    else if (action === 'reset') reset();
    else if (action === 'close') box.close();
  });
  box.addEventListener('keydown', event => {
    if (event.key === '+' || event.key === '=') zoomCenter(1.5);
    else if (event.key === '-') zoomCenter(1 / 1.5);
    else if (event.key === '0') reset();
  });
  stage.addEventListener('wheel', event => {
    event.preventDefault();
    zoomAt(Math.exp(-event.deltaY * 0.0015), event.clientX, event.clientY);
  }, {passive: false});
  stage.addEventListener('dblclick', event => {
    if (scale > 1) reset(); else zoomAt(2.5, event.clientX, event.clientY);
  });
  stage.addEventListener('pointerdown', event => {
    // pointer capture retargets pointerup to the stage, so note where the press started
    downOnImage = event.target === big;
    stage.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    moved = false;
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = {d: Math.hypot(a.x - b.x, a.y - b.y), scale};
    } else dragStart = {x: event.clientX - tx, y: event.clientY - ty};
  });
  stage.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, {x: event.clientX, y: event.clientY});
    if (pointers.size === 2 && pinchStart) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((pinchStart.scale * d / pinchStart.d) / scale, (a.x + b.x) / 2, (a.y + b.y) / 2);
      moved = true;
    } else if (dragStart && scale > 1) {
      tx = event.clientX - dragStart.x; ty = event.clientY - dragStart.y;
      moved = true; apply();
    }
  });
  const endPointer = event => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinchStart = null;
    if (pointers.size === 0) dragStart = null;
  };
  stage.addEventListener('pointerup', event => {
    // a plain click on the empty area around an unzoomed image closes the viewer
    if (!moved && scale === 1 && !downOnImage) box.close();
    endPointer(event);
  });
  stage.addEventListener('pointercancel', endPointer);
  box.addEventListener('close', () => { big.removeAttribute('src'); lastOpener?.focus({preventScroll: true}); });
}
