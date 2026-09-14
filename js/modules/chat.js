// File: js/modules/chat.js
import { db, ref, onValue, push, serverTimestamp } from '../firebase.js';

export function initChat() {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatStream = document.getElementById('chatStream');
  
  // Ambil atau buat ID Perangkat Unik untuk Penumpang
  let clientId = localStorage.getItem('futaqi_client_id');
  if (!clientId) {
    clientId = 'CLIENT_' + Math.random().toString(36).substring(2, 6).toUpperCase();
    localStorage.setItem('futaqi_client_id', clientId);
  }

  // Listener Firebase untuk membaca pesan masuk
  const chatRef = ref(db, 'chat/messages');
  onValue(chatRef, (snapshot) => {
    chatStream.innerHTML = ''; // Bersihkan layar chat
    const data = snapshot.val();
    
    if (!data) {
      chatStream.innerHTML = `<div class="text-center text-[10px] mt-4" style="color: var(--text-secondary);">ENKRIPSI END-TO-END AKTIF. TUNGGU INSTRUKSI...</div>`;
      return;
    }

    // Render setiap pesan
    Object.keys(data).forEach((key) => {
      const msg = data[key];
      const isMe = msg.senderId === clientId;
      
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3`;
      
      msgDiv.innerHTML = `
        <span class="text-[9px] mb-0.5 opacity-70" style="color: ${isMe ? 'var(--color-cyan)' : 'var(--color-magenta)'};">
          ${isMe ? 'SAYA' : 'DRIVER (FUTAQI ALI)'}
        </span>
        <div class="px-3 py-2 rounded-sm border max-w-[85%]" 
             style="border-color: ${isMe ? 'var(--color-cyan)' : 'var(--color-magenta)'}; 
                    background: ${isMe ? 'var(--color-cyan-dim)' : 'var(--color-magenta-dim)'};
                    color: var(--text-primary);">
          ${escapeHtml(msg.text)}
        </div>
      `;
      chatStream.appendChild(msgDiv);
    });

    // Auto-scroll ke bawah saat ada pesan baru
    chatStream.scrollTop = chatStream.scrollHeight;
  });

  // Event kirim pesan
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    if (navigator.vibrate) navigator.vibrate(20); // Efek tembakan data

    // Kirim ke Firebase
    push(chatRef, {
      senderId: clientId,
      text: text,
      timestamp: serverTimestamp()
    });

    chatInput.value = ''; // Kosongkan input
  });
}

// Utilitas keamanan untuk mencegah XSS (Hacker inject script)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
