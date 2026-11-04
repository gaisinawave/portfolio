(() => {
  'use strict';
  const loop = document.querySelector('#loop');
  const original = loop.firstElementChild;
  const before = original.cloneNode(true), after = original.cloneNode(true);
  for (const copy of [before, after]) {
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
  }
  loop.prepend(before); loop.append(after);
  let length = 0, ready = false, navigating = false;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  history.scrollRestoration = 'manual';
  function layout() {
    const oldLength = length;
    const offset = ready ? window.scrollY - oldLength : 0;
    const width = original.querySelector('.card').getBoundingClientRect().width;
    document.documentElement.style.setProperty('--card-scale', width / 460);
    document.documentElement.style.setProperty('--hero-scale', window.innerWidth / 1440);
    length = original.getBoundingClientRect().height;
    if (length > 0) {
      window.scrollTo({top: length + (oldLength ? offset / oldLength * length : 0), behavior:'instant'});
      ready = true;
    }
  }
  function wrap() {
    if (!ready || navigating || !length) return;
    const y = window.scrollY;
    if (y < length || y >= length * 2) {
      const offset = ((y - length) % length + length) % length;
      window.scrollTo({top:length + offset, behavior:'instant'});
    }
  }
  addEventListener('scroll', wrap, {passive:true});
  let resizeFrame;
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(layout);
  });
  let navTimer;
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    event.preventDefault();
    const anchor = link.getAttribute('href').slice(1);
    const target = anchor === 'home' ? original : original.querySelector(`[data-anchor="${anchor}"]`);
    if (!target) return;
    navigating = true;
    clearTimeout(navTimer);
    window.scrollTo({top:window.scrollY + target.getBoundingClientRect().top, behavior:reducedMotion.matches ? 'instant' : 'smooth'});
    navTimer = setTimeout(() => {navigating = false; wrap();}, 1200);
  });
  layout();
  document.fonts.ready.then(() => {
    layout();
    const anchor = location.hash.slice(1);
    const target = anchor === 'home' ? original : original.querySelector(`[data-anchor="${CSS.escape(anchor)}"]`);
    if (target) window.scrollTo({top:window.scrollY + target.getBoundingClientRect().top, behavior:'instant'});
  });
})();
