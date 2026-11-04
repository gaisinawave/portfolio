const soon = document.querySelector('.project-soon');
soon.addEventListener('click', () => {const visible=soon.classList.toggle('is-revealed');soon.setAttribute('aria-pressed',String(visible));});
soon.addEventListener('keydown',event=>{if(event.key==='Escape'){soon.classList.remove('is-revealed');soon.setAttribute('aria-pressed','false');soon.blur();}});

const video = document.querySelector('.project-media video');
const toggle = document.querySelector('.video-toggle');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = motion.matches;
let inView = false;
video.muted = true;
function syncPlayback() {
  if (inView && !document.hidden && !userPaused) video.play().catch(() => {});
  else video.pause();
}
function syncButton() {
  toggle.textContent = video.paused ? 'воспроизвести' : 'пауза';
  toggle.setAttribute('aria-label', (video.paused ? 'Воспроизвести' : 'Приостановить') + ' видео Visual Bakery');
}
video.addEventListener('play', syncButton);
video.addEventListener('pause', syncButton);
toggle.addEventListener('click', () => { userPaused = !video.paused; syncPlayback(); });
new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncPlayback(); }, {threshold: .05}).observe(video);
document.addEventListener('visibilitychange', syncPlayback);
motion.addEventListener('change', () => { userPaused = motion.matches; syncPlayback(); });
