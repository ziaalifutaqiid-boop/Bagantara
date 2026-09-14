// File: js/modules/ui.js

export function initUI() {
  const htmlEl = document.documentElement;
  const themeBtn = document.getElementById('btnThemeToggle');
  const telemetryEl = document.getElementById('clientTelemetry');
  
  // ==========================================
  // 1. MESIN TEMA (MODE SIANG / MALAM)
  // ==========================================
  let currentTheme = localStorage.getItem('futaqi_theme') || 'dark';
  htmlEl.setAttribute('data-theme', currentTheme);
  updateThemeBtn();

  themeBtn.addEventListener('click', () => {
    // Getaran taktis saat ditekan (Haptic Feedback)
    if (navigator.vibrate) navigator.vibrate(15);
    
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlEl.setAttribute('data-theme', currentTheme);
    localStorage.setItem('futaqi_theme', currentTheme);
    updateThemeBtn();
  });

  function updateThemeBtn() {
    themeBtn.textContent = currentTheme === 'dark' ? '[ MODE_SIANG ]' : '[ MODE_MALAM ]';
    // Menyesuaikan warna tombol dengan tema yang aktif
    themeBtn.style.color = currentTheme === 'dark' ? 'var(--text-primary)' : 'var(--color-cyan)';
    themeBtn.style.borderColor = currentTheme === 'dark' ? 'var(--text-muted)' : 'var(--color-cyan)';
  }

  // ==========================================
  // 2. SISTEM TELEMETRI KLIEN (BATERAI & PING)
  // ==========================================
  function updateTelemetry() {
    let battTxt = 'SYS_CHK';
    let pingTxt = '--ms';

    // Baca status baterai (Jika didukung browser)
    if (navigator.getBattery) {
      navigator.getBattery().then(batt => {
        battTxt = Math.round(batt.level * 100) + '%';
        if (batt.charging) battTxt += ' (CHG)';
        renderTelemetry();
      }).catch(() => { battTxt = 'N/A'; renderTelemetry(); });
    }

    // Baca status koneksi jaringan
    if (navigator.connection) {
      pingTxt = navigator.connection.rtt ? navigator.connection.rtt + 'ms' : navigator.connection.effectiveType;
    }

    function renderTelemetry() {
      if (telemetryEl) {
        telemetryEl.textContent = `BATT: ${battTxt} | PING: ${pingTxt}`;
      }
    }
    
    renderTelemetry();
  }

  // Perbarui data telemetri setiap 5 detik agar tidak boros memori
  setInterval(updateTelemetry, 5000);
  updateTelemetry();
}
