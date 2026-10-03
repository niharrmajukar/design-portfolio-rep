(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (reducedMotion || !finePointer) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-trail-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(canvas);
  const context = canvas.getContext('2d');
  const particles = [];
  let width = 0;
  let height = 0;
  let raf = 0;
  let pointer = { x: -100, y: -100, active: false };

  const resize = () => {
    width = canvas.width = window.innerWidth * window.devicePixelRatio;
    height = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };
  const addParticle = (x, y) => {
    particles.push({ x, y, size: Math.random() * 3.5 + 2, life: 1, vx: (Math.random() - .5) * 1.2, vy: (Math.random() - .5) * 1.2 });
    if (particles.length > 42) particles.shift();
  };
  const render = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach((particle) => {
      particle.life -= .025;
      particle.x += particle.vx;
      particle.y += particle.vy;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      context.fillStyle = `rgba(214, 255, 63, ${particle.life * .8})`;
      context.fill();
    });
    for (let index = particles.length - 1; index >= 0; index -= 1) if (particles[index].life <= 0) particles.splice(index, 1);
    raf = window.requestAnimationFrame(render);
  };
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
    if (Math.random() > .22) addParticle(pointer.x, pointer.y);
  }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
  resize();
  render();
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(raf), { once: true });
})();
