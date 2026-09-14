// File: js/modules/radar.js
import { db, ref, onValue } from '../firebase.js';

export function initRadar() {
  const canvas = document.getElementById('radarCanvas');
  const ctx = canvas.getContext('2d');
  const btnLiveGmaps = document.getElementById('btnLiveGmaps');
  const gmapsStatus = document.getElementById('gmapsStatus');
  
  // 1. Sinkronisasi Link G-Maps Real-Time dari Firebase
  onValue(ref(db, 'config/mapsUrl'), (snapshot) => {
    const url = snapshot.val();
    if (url) {
      btnLiveGmaps.href = url;
      btnLiveGmaps.classList.remove('opacity-50', 'pointer-events-none');
      gmapsStatus.textContent = "Kunci rute aktif. Ketuk untuk membuka G-Maps.";
      gmapsStatus.style.color = "var(--color-emerald)";
    } else {
      btnLiveGmaps.href = "#";
      btnLiveGmaps.classList.add('opacity-50', 'pointer-events-none');
      gmapsStatus.textContent = "Sinyal rute terputus/Driver belum membagikan rute.";
      gmapsStatus.style.color = "var(--text-secondary)";
    }
  });

  // 2. Animasi Visual Canvas (Sama seperti sebelumnya, disingkat untuk fokus)
  function resizeCanvas() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let angle = 0;
  function drawRadar() {
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2, radius = Math.min(w,h)/2 - 10;
    ctx.fillStyle = 'rgba(3, 5, 8, 0.2)'; ctx.fillRect(0,0,w,h);
    
    ctx.strokeStyle = '#00f2fe'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy-radius); ctx.lineTo(cx, cy+radius); ctx.stroke();
    
    ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,radius,angle,angle+0.2); ctx.fillStyle = '#00f2fe'; ctx.fill();
    
    angle += 0.05; if (angle > Math.PI*2) angle = 0;
    requestAnimationFrame(drawRadar);
  }
  drawRadar();
}
