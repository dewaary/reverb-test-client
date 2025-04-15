import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
});

console.log('Listening...');

window.Echo.channel('translation-channel')
  .listen('.translation-event', (e) => {
    console.log('Event received:', e);

    const originalBox = document.getElementById('original-text');
    const translatedBox = document.getElementById('translated-text');

    console.log("original text", originalBox)
    console.log("translate log", translatedBox);
    

    // Pastikan element ada
    if (originalBox && translatedBox) {
      originalBox.textContent = e.original_text;
      translatedBox.textContent = e.translated_text;
    } else {
      console.error("Elements not found!");
    }
  });

let timeout = null;

document.getElementById('input-text').addEventListener('input', () => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const text = document.getElementById('input-text').value;
    const target = document.getElementById('target-lang').value;

    if (text.trim() === '') return;

    fetch('https://dev-atlasai-api.aws-backend.com/api/translation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ text, target }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Sent:', data);
      })
      .catch(error => console.error('Error:', error));
  }, 500);
});
