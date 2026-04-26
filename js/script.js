let score = 96;
console.log(score*2);

const menuBtn = document.getElementById('menu-btn');
const nav = document.querySelector('nav');

// クリックでメニュー開閉
menuBtn.addEventListener('click', () => {
menuBtn.classList.toggle('active');
nav.classList.toggle('active');
document.body.classList.toggle('no-scroll');
});

const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
link.addEventListener('click', () => {
menuBtn.classList.remove('active');
nav.classList.remove('active');
document.body.classList.remove('no-scroll');
});
});

document.getElementById('chat-send').addEventListener('click', async () => {
  const input = document.getElementById('chat-input');
  const messages = document.getElementById('chat-messages');
  const userText = input.value.trim();
  if (!userText) return;

  messages.innerHTML += `<div class="message user">${userText}</div>`;
  input.value = '';

  const res = await fetch('https://uhdu8gkjs3.execute-api.us-east-1.amazonaws.com/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userText })
  });

 const data = await res.json();
  const formatted = data.reply
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/#{1,3}\s?(.*?)(\n|$)/g, '<br><strong>$1</strong><br>')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/---/g, '<hr>')
    .replace(/\|.*\|/g, '')
    .replace(/\n/g, '<br>');
  messages.innerHTML += `<div class="message bot">${formatted}</div>`;
  messages.scrollTop = messages.scrollHeight;
});