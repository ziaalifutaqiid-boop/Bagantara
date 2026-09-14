// File: js/modules/data-sync.js
import { db, ref, onValue } from '../firebase.js';

export function initDataSync() {
  const reviewsContainer = document.getElementById('reviewsContainer');
  const promoContainer = document.getElementById('promoContainer');

  // Sync Promo
  onValue(ref(db, 'promos'), (snapshot) => {
    const data = snapshot.val();
    promoContainer.innerHTML = '';
    if (!data) {
      promoContainer.innerHTML = '<div class="text-center text-[10px] text-gray-500">Tidak ada intel/promo aktif.</div>';
      return;
    }
    Object.keys(data).forEach(key => {
      const item = data[key];
      promoContainer.innerHTML += `
        <div class="wireframe-panel p-3 rounded-lg">
          <div class="text-[11px] font-bold font-tech text-cyan-400 uppercase tracking-widest">${item.title || ''}</div>
          <p class="text-[10px] text-gray-400 mt-1">${item.desc || ''}</p>
        </div>
      `;
    });
  });

  // Sync Reviews
  onValue(ref(db, 'reviews'), (snapshot) => {
    const data = snapshot.val();
    reviewsContainer.innerHTML = '';
    if (!data) {
      reviewsContainer.innerHTML = '<div class="text-center text-[10px] text-gray-500">Database ulasan kosong.</div>';
      return;
    }
    const keys = Object.keys(data).reverse(); // Terbaru di atas
    keys.forEach(key => {
      const r = data[key];
      const stars = '★'.repeat(r.rating || 5) + '☆'.repeat(5 - (r.rating || 5));
      reviewsContainer.innerHTML += `
        <div class="wireframe-panel p-3 rounded-lg">
          <div class="flex justify-between items-center mb-1">
            <span class="text-[10px] font-bold text-white uppercase">${r.name || 'Anonim'}</span>
            <span class="text-[10px] text-amber-400">${stars}</span>
          </div>
          <p class="text-[10px] text-gray-400">${r.comment || ''}</p>
        </div>
      `;
    });
  });
}
