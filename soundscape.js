(() => {
  const toggle = document.querySelector('[data-sound-toggle]');
  if (!toggle) return;
  let context = null;
  let master = null;
  let ambient = null;
  let enabled = false;
  const sync = () => {
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.setAttribute('aria-label', enabled ? 'Turn sound off' : 'Turn sound on');
    const label = toggle.querySelector('[data-sound-label]');
    if (label) label.textContent = enabled ? 'Sound on' : 'Sound off';
  };
  const ensureAudio = () => {
    if (context) return;
    context = new (window.AudioContext || window.webkitAudioContext)();
    master = context.createGain();
    master.gain.value = .035;
    master.connect(context.destination);
  };
  const startAmbient = () => {
    ensureAudio();
    if (context.state === 'suspended') context.resume();
    if (ambient) return;
    ambient = context.createOscillator();
    const toneGain = context.createGain();
    ambient.type = 'sine';
    ambient.frequency.value = 174;
    toneGain.gain.value = .08;
    ambient.connect(toneGain).connect(master);
    ambient.start();
  };
  const playTick = (frequency = 480, duration = .045) => {
    if (!enabled) return;
    ensureAudio();
    if (context.state === 'suspended') context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  };
  toggle.addEventListener('click', () => {
    enabled = !enabled;
    if (enabled) { startAmbient(); playTick(620, .08); }
    else if (master) master.gain.setTargetAtTime(0, context.currentTime, .06);
    if (enabled && master) master.gain.setTargetAtTime(.035, context.currentTime, .12);
    try { localStorage.setItem('nihar-sound', enabled ? 'on' : 'off'); } catch {}
    sync();
  });
  document.addEventListener('click', (event) => {
    if (enabled) startAmbient();
    if (event.target.closest('button, a') && !event.target.closest('[data-sound-toggle]')) playTick(390, .035);
  }, { passive: true });
  try { enabled = localStorage.getItem('nihar-sound') === 'on'; } catch {}
  sync();
})();
