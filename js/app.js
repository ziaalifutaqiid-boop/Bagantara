// File: js/app.js

import { initUI } from './modules/ui.js';
import { initViewController } from './modules/view-controller.js';

// Pastikan skrip berjalan setelah HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // 1. Hidupkan Mesin Tema & Telemetri
  initUI();
  
  // 2. Hidupkan Sistem Navigasi Panel (SPA)
  initViewController();
  
  console.log("SYSTEM BOOT: Tactical Dashboard Online.");
});
