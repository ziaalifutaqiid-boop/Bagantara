// File: js/modules/view-controller.js

export function initViewController() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const backBtns = document.querySelectorAll('.back-btn');
  const panels = document.querySelectorAll('.spa-panel');

  // Fungsi inti pergantian panel
  function switchPanel(targetId) {
    panels.forEach(panel => {
      if (panel.id === targetId) {
        panel.classList.add('active');
        // Fokuskan scroll ke atas saat ganti halaman
        window.scrollTo(0, 0); 
      } else {
        panel.classList.remove('active');
      }
    });
  }

  // Deteksi klik pada tombol menu utama
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate([10, 30, 10]); // Haptic feedback unik
      const target = btn.getAttribute('data-target');
      if (target) switchPanel(target);
    });
  });

  // Deteksi klik pada tombol "[ < KEMBALI ]"
  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.vibrate) navigator.vibrate(10);
      switchPanel('hub-panel');
    });
  });
}
