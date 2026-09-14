// File: js/modules/beacon.js
import { db, ref, onValue } from '../firebase.js';

export function initBeacon() {
  let audioCtx = null;
  let alarmInterval = null;
  let isAlarmActive = false;

  // Elemen Visual Peringatan yang disuntikkan ke DOM
  const alertOverlay = document.createElement('div');
  alertOverlay.className = "fixed inset-0 z-[100] border-[8px] border-red-500 pointer-events-none opacity-0 transition-opacity duration-100 flex items-center justify-center";
  alertOverlay.innerHTML = `<div class="bg-red-500/20 px-6 py-2 border border-red-500 text-red-400 font-tech font-bold text-xl uppercase tracking-widest backdrop-blur-md animate-pulse">DRIVER DI LOKASI</div>`;
  document.body.appendChild(alertOverlay);

  function playDigitalBeep() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    // Nada Beep Frekuensi Tinggi ala Mesin Medis/Hacker
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(2500, audioCtx.currentTime); // 2500Hz tajam
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime); // Volume rendah agar tidak merusak telinga
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);

    // Efek Visual & Getar
    alertOverlay.classList.remove('opacity-0');
    setTimeout(() => alertOverlay.classList.add('opacity-0'), 150);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }

  // Listener ke Firebase
  onValue(ref(db, 'status/alarmActive'), (snapshot) => {
    const isTriggered = snapshot.val();
    
    if (isTriggered && !isAlarmActive) {
      isAlarmActive = true;
      alertOverlay.classList.remove('hidden');
      alarmInterval = setInterval(playDigitalBeep, 1000); // Bunyi tiap 1 detik
    } else if (!isTriggered && isAlarmActive) {
      isAlarmActive = false;
      clearInterval(alarmInterval);
      alertOverlay.classList.add('hidden');
    }
  });
}
