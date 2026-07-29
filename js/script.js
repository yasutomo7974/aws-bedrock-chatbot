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

document.getElementById('chat-send')?.addEventListener('click', async () => {
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

// ===== WordPress ブログ記事を取得して表示 =====
async function loadBlogPosts() {
  const blogList = document.getElementById('blog-list');
  if (!blogList) return;

  try {
    const res = await fetch('https://yasulog-life.com/wp-json/wp/v2/posts?per_page=3&_embed');
    const posts = await res.json();

    blogList.innerHTML = posts.map(post => {
      // アイキャッチ画像を取得（なければデフォルト）
      const thumb = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        || 'https://yasulog-life.com/wp-content/uploads/2026/04/aws-1024x576.png';

      // 本文の抜粋（HTMLタグ除去）
      const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 60) + '...';

      // 日付フォーマット
      const date = new Date(post.date).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      return `
        <div class="blog-item">
          <img src="${thumb}" alt="${post.title.rendered}" loading="lazy">
          <p class="blog-date">${date}</p>
          <h3>${post.title.rendered}</h3>
          <p>${excerpt}</p>
          <a href="${post.link}" target="_blank">続きを読む →</a>
        </div>
      `;
    }).join('');

  } catch (err) {
    blogList.innerHTML = '<p style="text-align:center;color:#888;">記事の読み込みに失敗しました。</p>';
    console.error(err);
  }
}

loadBlogPosts();