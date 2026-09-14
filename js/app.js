// File: js/app.js
import { initUI } from './modules/ui.js';
import { initViewController } from './modules/view-controller.js';
import { initChat } from './modules/chat.js';
import { initRadar } from './modules/radar.js';
import { initDataSync } from './modules/data-sync.js';
import { initBeacon } from './modules/beacon.js';

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initViewController();
  initChat();
  initRadar();
  initDataSync();
  initBeacon();
  console.log("CLIENT FRONT-END FINALIZED. ALL SYSTEMS GO.");
});
