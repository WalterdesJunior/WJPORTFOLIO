/* ━━ AOS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
AOS.init({ once: false, offset: 10 });

/* ━━ LAZY VIDEO (card thumbnails) ━━━━━━━━ */
const lazyVideoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const v = entry.target;
    if (entry.isIntersecting) {
      if (!v.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.lazy-video').forEach(v => lazyVideoObserver.observe(v));

/* ━━ WELCOME SCREEN ━━━━━━━━━━━━━━━━━━━━━━ */
(() => {
  const cmdEl = document.getElementById('wc-cmd');
  const caretEl = document.getElementById('wc-caret');
  const outEl = document.getElementById('wc-out');
  const barEl = document.getElementById('wc-progress-bar');
  const wc = document.getElementById('welcome');
  if (!cmdEl) return;

  const command = 'npm run build --portfolio';
  const outputs = [
    '✓ módulos compilados',
    '✓ assets otimizados',
    '✓ pronto'
  ];

  let i = 0;
  const typeSpeed = 38;

  function typeChar() {
    if (i < command.length) {
      cmdEl.textContent += command[i];
      i++;
      setTimeout(typeChar, typeSpeed);
    } else {
      setTimeout(showOutputs, 280);
    }
  }

  function showOutputs() {
    caretEl.style.display = 'none';
    barEl.style.width = '100%';
    outputs.forEach((line, idx) => {
      const div = document.createElement('div');
      div.textContent = line;
      div.style.animationDelay = `${idx * 220}ms`;
      if (idx === outputs.length - 1) div.classList.add('wc-ready');
      outEl.appendChild(div);
    });
    setTimeout(finish, outputs.length * 220 + 650);
  }

  function finish() {
    wc.classList.add('out');
    setTimeout(() => { wc.style.display = 'none'; }, 900);
  }

  setTimeout(typeChar, 500);
})();

/* ━━ CURSOR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const CUR = document.getElementById('cur'), RING = document.getElementById('cur-r');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  CUR.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
}, { passive: true });
(function tick() {
  rx += (mx-rx)*.1; ry += (my-ry)*.1;
  RING.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button,.proj-card,.cert-card,.stack-card,.metric-item,.ptab').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cg'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cg'));
});

/* ━━ BLOB PARALLAX ━━━━━━━━━━━━━━━━━━━━━━━ */
const blobs = [
  { el: document.getElementById('blob1'), ix: -80, iy: -40 },
  { el: document.getElementById('blob2'), ix: -80, iy: -40 },
  { el: document.getElementById('blob3'), ix: 80,  iy: -60 },
  { el: document.getElementById('blob4'), ix: 80,  iy: -60 },
];
function updateBlobs(sy) {
  blobs.forEach((b, i) => {
    const xo = Math.sin(sy/100 + i*.5) * 340;
    const yo = Math.cos(sy/100 + i*.5) * 40;
    b.el.style.transform = `translate3d(${b.ix+xo}px, ${b.iy+yo}px, 0)`;
  });
}

/* ━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const nav = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

let sectionOffsets = [];
function cacheSectionOffsets() {
  sectionOffsets = Array.from(sections).map(s => ({ id: s.id, top: s.offsetTop }));
}
cacheSectionOffsets();
window.addEventListener('resize', cacheSectionOffsets, { passive: true });

function updateNav(sy) {
  nav.classList.toggle('scrolled', sy > 20);
  let cur = '';
  sectionOffsets.forEach(s => {
    if (sy >= s.top - 550) cur = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.s === cur);
  });
}

/* Single rAF-batched scroll tick — avoids redundant layout/paint work per scroll event */
let scrollTicking = false;
function onScroll() {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const sy = window.pageYOffset;
    updateBlobs(sy);
    updateNav(sy);
    scrollTicking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
updateNav(window.pageYOffset);

/* smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ━━ MOBILE MENU ━━━━━━━━━━━━━━━━━━━━━━━━━ */
const ham = document.getElementById('ham-btn');
const mob = document.getElementById('mob-menu');
let menuOpen = false;
ham.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mob.classList.toggle('open', menuOpen);
  mob.style.display = menuOpen ? 'flex' : 'none';
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  const bars = ham.querySelectorAll('.ham-bar');
  if (menuOpen) {
    bars[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
  }
});
function closeMob() {
  menuOpen = false;
  mob.classList.remove('open');
  mob.style.display = 'none';
  document.body.style.overflow = '';
  ham.querySelectorAll('.ham-bar').forEach(b => { b.style.transform=''; b.style.opacity=''; });
}

/* ━━ TYPEWRITER ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const WORDS = ['Estudante de Eng. de Software', 'Full Stack Developer', 'Mobile Developer', 'AWS Cloud Certified'];
let wIdx=0, cIdx=0, typing=true;
const twEl = document.getElementById('tw-text');

function typeLoop() {
  if (typing) {
    if (cIdx < WORDS[wIdx].length) {
      twEl.textContent += WORDS[wIdx][cIdx++];
      setTimeout(typeLoop, 90);
    } else {
      typing = false;
      setTimeout(typeLoop, 2200);
    }
  } else {
    if (cIdx > 0) {
      twEl.textContent = WORDS[wIdx].slice(0, --cIdx);
      setTimeout(typeLoop, 45);
    } else {
      wIdx = (wIdx+1) % WORDS.length;
      typing = true;
      setTimeout(typeLoop, 300);
    }
  }
}
typeLoop();

/* ━━ TABS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
  btn.classList.add('active');
  AOS.refresh();
}

/* ━━ CONTACT SWITCH ━━━━━━━━━━━━━━━━━━━━━━ */
function switchContact(name, btn) {
  document.querySelectorAll('.cc-switch-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.cc-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('cc-pane-' + name).classList.add('active');
  document.getElementById('cc-switch-thumb').style.transform =
    name === 'msg' ? 'translateX(0%)' : 'translateX(100%)';
}

/* ━━ TOGGLE PROJECTS ━━━━━━━━━━━━━━━━━━━━━ */
let showAll = false;
function toggleProjects() {
  showAll = !showAll;
  document.getElementById('proj-extra-1').style.display = showAll ? 'block' : 'none';
  document.getElementById('proj-extra-4').style.display = showAll ? 'block' : 'none';
  document.getElementById('proj-extra-5').style.display = showAll ? 'block' : 'none';
  document.getElementById('proj-toggle').textContent = showAll ? 'Ver Menos ↑' : 'Ver Mais ↓';
  if (showAll) AOS.refresh();
}

/* ━━ CONTACT FORM — Formspree ━━━━━━━━━━━━
   Cole sua URL do Formspree abaixo.
   Como obter: formspree.io → New Form → copie a URL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const FORMSPREE_URL = 'https://formspree.io/f/mnjrdead';

async function sendMsg() {
  const n = document.getElementById('fn').value.trim();
  const e = document.getElementById('fe').value.trim();
  const m = document.getElementById('fm').value.trim();
  if (!n || !e || !m) { alert('Preencha todos os campos!'); return; }

  const btn = document.getElementById('send-btn');
  btn.disabled = true;
  btn.innerHTML = '⏳ Enviando...';

  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: n, email: e, message: m })
    });

    if (res.ok) {
      btn.innerHTML = '✅ Mensagem Enviada!';
      btn.style.background = 'linear-gradient(135deg,#16a34a,#15803d)';
      document.getElementById('fn').value = '';
      document.getElementById('fe').value = '';
      document.getElementById('fm').value = '';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '✈ Enviar Mensagem';
        btn.style.background = '';
      }, 3500);
    } else {
      throw new Error('Falha no envio');
    }
  } catch {
    btn.innerHTML = '❌ Erro — tente novamente';
    btn.style.background = 'linear-gradient(135deg,#dc2626,#b91c1c)';
    btn.disabled = false;
    setTimeout(() => { btn.innerHTML = '✈ Enviar Mensagem'; btn.style.background = ''; }, 3000);
  }
}

/* ━━ COMMENTS — Firebase Firestore (visível para todos os visitantes) ━━
   Console: https://console.firebase.google.com/project/portfolio-comments-5ea2d
   Coleção "comments": { name, text, likes, createdAt }
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const firebaseConfig = {
  apiKey: "AIzaSyCH73m84CXcw4kUZmNof9juFbTsf7xKyOU",
  authDomain: "portfolio-comments-5ea2d.firebaseapp.com",
  projectId: "portfolio-comments-5ea2d",
  storageBucket: "portfolio-comments-5ea2d.firebasestorage.app",
  messagingSenderId: "293275333506",
  appId: "1:293275333506:web:87b7c718309392dba7559b"
};

const DEFAULT_COMMENT = {
  id: 'default',
  name: 'Walterdes Júnior',
  text: 'Obrigado por visitar meu portfólio! Qualquer dúvida, é só chamar. 🚀',
  pinned: true,
  likes: 2
};

const LIKED_KEY = 'portfolio_liked_comments';
function getLikedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(LIKED_KEY)) || []); } catch { return new Set(); }
}
function markLiked(id) {
  const liked = getLikedSet();
  liked.add(id);
  localStorage.setItem(LIKED_KEY, JSON.stringify([...liked]));
}
function unmarkLiked(id) {
  const liked = getLikedSet();
  liked.delete(id);
  localStorage.setItem(LIKED_KEY, JSON.stringify([...liked]));
}

let commentsDb, fsApi;

function buildCommentEl(c) {
  const liked = getLikedSet().has(c.id);

  const el = document.createElement('div');
  el.className = 'c-item';

  const avatar = document.createElement('div');
  avatar.className = 'c-avatar';
  avatar.textContent = c.name[0].toUpperCase();

  const body = document.createElement('div');
  const nameEl = document.createElement('div');
  nameEl.className = 'c-name';
  nameEl.textContent = c.name;
  const textEl = document.createElement('div');
  textEl.className = 'c-text';
  textEl.textContent = c.text;
  body.appendChild(nameEl);
  body.appendChild(textEl);

  el.appendChild(avatar);
  el.appendChild(body);

  if (c.pinned) {
    const pin = document.createElement('span');
    pin.className = 'c-pinned';
    pin.textContent = '📌 PINNED';
    el.appendChild(pin);
  }

  const likeBtn = document.createElement('span');
  likeBtn.className = 'c-likes' + (liked ? ' liked' : '') + (c.pinned ? ' c-likes--static' : '');
  likeBtn.textContent = `${liked ? '♥' : '♡'} ${c.likes || 0}`;
  if (!c.pinned) likeBtn.onclick = () => likeComment(c.id, likeBtn);
  el.appendChild(likeBtn);

  return el;
}

function renderComments(liveComments) {
  const list = document.getElementById('comments-list');
  list.innerHTML = '';
  list.appendChild(buildCommentEl(DEFAULT_COMMENT));
  liveComments.forEach(c => list.appendChild(buildCommentEl(c)));

  const countEl = document.getElementById('cc-comment-count');
  if (countEl) countEl.textContent = 1 + liveComments.length;
}

async function likeComment(id, btn) {
  if (!commentsDb) return;
  const wasLiked = getLikedSet().has(id);
  const delta = wasLiked ? -1 : 1;
  const currentCount = parseInt(btn.textContent.replace(/\D/g, ''), 10) || 0;
  const newCount = Math.max(0, currentCount + delta);

  if (wasLiked) unmarkLiked(id); else markLiked(id);
  btn.classList.toggle('liked', !wasLiked);
  btn.textContent = `${wasLiked ? '♡' : '♥'} ${newCount}`;

  try {
    await fsApi.updateDoc(fsApi.doc(commentsDb, 'comments', id), { likes: fsApi.increment(delta) });
  } catch (err) {
    console.error('Erro ao curtir/descurtir:', err);
    if (wasLiked) markLiked(id); else unmarkLiked(id);
    btn.classList.toggle('liked', wasLiked);
    btn.textContent = `${wasLiked ? '♥' : '♡'} ${currentCount}`;
  }
}

async function postComment() {
  const n = document.getElementById('cn').value.trim();
  const t = document.getElementById('ct').value.trim();
  if (!n || !t) { alert('Preencha nome e comentário!'); return; }
  if (!commentsDb) { alert('Comentários indisponíveis agora, tente novamente em instantes.'); return; }

  try {
    await fsApi.addDoc(fsApi.collection(commentsDb, 'comments'), {
      name: n,
      text: t,
      likes: 0,
      createdAt: fsApi.serverTimestamp()
    });
    document.getElementById('cn').value = '';
    document.getElementById('ct').value = '';
    document.getElementById('comments-list').lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    notifyNewComment(n, t);
  } catch (err) {
    console.error('Erro ao comentar:', err);
    alert('Não foi possível publicar o comentário. Tente novamente.');
  }
}

function notifyNewComment(name, text) {
  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      name,
      message: text,
      _subject: `💬 Novo comentário de ${name} no portfólio`
    })
  }).catch(() => {});
}

(async function initComments() {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js');
    fsApi = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js');
    const app = initializeApp(firebaseConfig);
    commentsDb = fsApi.getFirestore(app);

    const q = fsApi.query(fsApi.collection(commentsDb, 'comments'), fsApi.orderBy('createdAt', 'asc'));
    fsApi.onSnapshot(q, snapshot => {
      renderComments(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, err => {
      console.error('Erro ao carregar comentários:', err);
      renderComments([]);
    });
  } catch (err) {
    console.error('Firebase indisponível:', err);
    renderComments([]);
  }
})();

/* ━━ CERT MODAL ━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const CERT_DATA = {
  foundations: {
    name: 'AWS Academy Cloud Foundations',
    issuer: 'Amazon Web Services Academy',
    image: 'assets/img/cert-foundations.jpg'
  },
  developing: {
    name: 'AWS Cloud Developing',
    issuer: 'Amazon Web Services Academy',
    image: 'assets/img/cert-developing.jpg'
  },
  architecting: {
    name: 'AWS Cloud Architecting',
    issuer: 'Amazon Web Services Academy',
    image: 'assets/img/cert-architecting.jpg'
  },
};

function openCert(id) {
  const c = CERT_DATA[id];
  if (!c) return;

  const img = document.getElementById('cmodal-img');
  const placeholder = document.getElementById('cmodal-placeholder');
  const dlBtn = document.getElementById('cmodal-download');

  document.getElementById('cmodal-name').textContent = c.name;
  document.getElementById('cmodal-issuer').textContent = c.issuer;
  document.getElementById('cmodal-path').textContent = c.image;

  img.onload = function() {
    img.style.display = 'block';
    placeholder.style.display = 'none';
    dlBtn.style.display = 'inline-flex';
  };
  img.onerror = function() {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
    dlBtn.style.display = 'none';
  };
  img.src = c.image;
  dlBtn.href = c.image;

  document.getElementById('cert-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCert() {
  document.getElementById('cert-modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cert-modal').addEventListener('click', function(e) {
  if (e.target === this) closeCert();
});

/* ━━ ILLUS PARALLAX ━━━━━━━━━━━━━━━━━━━━━━ */
const illus = document.getElementById('illus');
if (illus) {
  document.addEventListener('mousemove', e => {
    const xr = (e.clientX / innerWidth  - .5) * 14;
    const yr = (e.clientY / innerHeight - .5) * 8;
    illus.style.transform = `perspective(900px) rotateY(${xr}deg) rotateX(${-yr}deg) scale(1.02)`;
  });
}

/* ━━ ESC ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLightbox(); closeProject(); closeCert(); if(menuOpen) closeMob(); }
});

/* ━━ PROJECT DATA ━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PROJECT_DATA = {
  petzone: {
    emoji: '🐾',
    title: 'PetZone — Tinder para Pets',
    tags: ['Mobile', 'React Native', 'Supabase', 'TypeScript'],
    desc: 'Aplicativo mobile de conexão entre tutores de pets — um swipe de cards estilo Tinder, mas para pets e seus donos, pensado para encontrar companheiros para passeios e brincadeiras. Projeto de extensão universitária do iCEV, desenvolvido em equipe com React Native + Expo e backend Supabase.',
    how: 'O tutor cadastra seu perfil e os pets (com foto, espécie, raça, idade, bio e carteirinha de vacinação) e desliza pelos cards de pets próximos, filtrando por espécie, raça, idade e distância via geolocalização. Quando há curtida mútua, é criado um match com chat em tempo real via Supabase Realtime. A interface suporta Português e Inglês e segue princípios de LGPD para consentimento e exclusão de dados.',
    goal: 'Criar um espaço seguro e divertido para tutores de pets se conectarem na vizinhança, incentivando socialização entre os animais e seus donos.',
    tech: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Zustand', 'React Navigation', 'i18next'],
    repo: 'https://github.com/marcusviniciusend/PetZone',
    device: 'phone',
    heroTrio: [
      'assets/img/petzone/login.png',
      'assets/img/petzone/swipe.png',
      'assets/img/petzone/matches.png'
    ],
    images: [
      'assets/img/petzone/cadastro.png',
      'assets/img/petzone/login.png',
      'assets/img/petzone/swipe.png',
      'assets/img/petzone/swipefiltros.png',
      'assets/img/petzone/matches.png',
      'assets/img/petzone/chat.png',
      'assets/img/petzone/meuspets.png',
      'assets/img/petzone/addpet.png',
      'assets/img/petzone/perfil.png',
      'assets/img/petzone/editarperfil.png',
      'assets/img/petzone/config.png'
    ]
  },
  segurosgestao: {
    emoji: '🏢',
    heroImage: 'assets/img/corretorpro/login.png',
    title: 'Sistema de Gestão — Corretora de Seguros',
    tags: ['Mobile/Desktop', 'Flutter', 'Em Desenvolvimento'],
    desc: 'Sistema de gestão integrada, CRM e backoffice para corretora de seguros, construído em Flutter. Projeto atualmente em desenvolvimento, com foco no controle de apólices, renovações, sinistros e comissionamento.',
    how: 'A aplicação centraliza o backoffice da corretora: cadastro e acompanhamento de apólices, controle de datas de renovação, abertura e acompanhamento de sinistros, e cálculo de comissionamento dos corretores. Construída com Flutter para rodar em múltiplas plataformas a partir de uma única base de código.',
    goal: 'Substituir controles manuais e planilhas por um sistema único que dê visibilidade completa da carteira de clientes da corretora, reduzindo erros operacionais e atrasos em renovações.',
    tech: ['Flutter', 'Dart'],
    repo: 'https://github.com/WalterdesJunior/seguros-gestao-app',
    images: [
      'assets/img/corretorpro/login.png',
      'assets/img/corretorpro/dashboardbeta.png',
      'assets/img/corretorpro/acompanhamentoapolices.png',
      'assets/img/corretorpro/acompanhamentoclientes.png',
      'assets/img/corretorpro/acompanhamentopropostas.png',
      'assets/img/corretorpro/cadastro.png',
      'assets/img/corretorpro/novocliente.png'
    ]
  },
  bookshelf: {
    emoji: '📰',
    title: 'BookShelf — Agregador de Notícias',
    tags: ['Mobile', 'Flutter', 'SQLite', 'GNews API'],
    desc: 'Aplicativo Flutter de agregação de notícias desenvolvido para o grêmio estudantil do ICEV — Instituto de Ensino Superior. Agrega manchetes de fontes jornalísticas reais via GNews API, organizadas por categoria, com busca por palavra-chave, filtro Brasil/Internacional e leitura completa via WebView embutido.',
    how: 'O usuário se cadastra e faz login com senha protegida via hash SHA-256, com auto-login nas próximas visitas. Na tela principal, navega por 6 categorias de notícias (Geral, Tecnologia, Esportes, Ciência, Saúde, Entretenimento), filtra entre Brasil e Internacional, busca por palavra-chave e salva artigos para ler depois. A leitura completa acontece dentro do próprio app via WebView, sem precisar abrir o navegador.',
    goal: 'Oferecer aos estudantes universitários uma forma rápida, organizada e confiável de se informar, fugindo da desinformação das redes sociais, com um app simples e focado em conteúdo jornalístico real.',
    tech: ['Flutter', 'Dart', 'SQLite', 'GNews API', 'WebView', 'SHA-256'],
    repo: 'https://github.com/WalterdesJunior/BOOKSHELF',
    device: 'phone',
    video: 'assets/img/bookshelf/bookshelf-demo.mp4',
    images: [
      'assets/img/bookshelf/login.jpg',
      'assets/img/bookshelf/cadastro.jpg',
      'assets/img/bookshelf/noticias.jpg',
      'assets/img/bookshelf/detalhe-noticia.jpg',
      'assets/img/bookshelf/salvos.jpg'
    ]
  },
  automacao: {
    emoji: '🧪',
    heroImage: 'assets/img/testesautomação/apitests.png',
    title: 'Projeto de Testes e Automação',
    tags: ['QA', 'Python', 'Selenium', 'CI/CD'],
    desc: 'Automação de testes em Python com dois módulos independentes: testes de API REST (Petstore) e testes Web E2E (SauceDemo), utilizando boas práticas como Page Object Model, fixtures com teardown e pipeline de CI/CD.',
    how: 'Os testes de API cobrem os endpoints de Pet, Store e User (criar, buscar, atualizar, filtrar e deletar) usando Pytest e Requests. Os testes Web usam Selenium com Page Object Model para cobrir login, carrinho, inventário e fluxo completo de compra no SauceDemo. Uma pipeline no GitHub Actions executa ambos os módulos a cada push/PR e publica relatórios HTML como artifacts.',
    goal: 'Demonstrar domínio de automação de testes profissional, aplicando boas práticas de QA (POM, fixtures, factories) tanto para APIs quanto para interfaces web, com integração contínua de ponta a ponta.',
    tech: ['Python', 'Pytest', 'Selenium', 'Requests', 'pytest-html', 'GitHub Actions'],
    repo: 'https://github.com/WalterdesJunior/testes-automacao',
    images: [
      'assets/img/testesautomação/apitests.png',
      'assets/img/testesautomação/webtests.png'
    ]
  },
  fincontrol: {
    emoji: '🤖',
    heroImage: 'assets/img/webfinanças/dashboard.png',
    title: 'FinControl — App Web de Gestão Financeira com IA',
    tags: ['Web', 'Next.js', 'IA', 'Em Desenvolvimento'],
    desc: 'Aplicação web full-stack de controle financeiro pessoal com dashboard, transações e metas financeiras, construída em Next.js com Supabase. Projeto em desenvolvimento ativo: a parte de assistente de IA (insights financeiros via chat) já está estruturada na interface, mas ainda está sendo implementada.',
    how: 'O usuário acompanha saldo, entradas e saídas no dashboard com gráficos de evolução mensal, cadastra transações por categoria e cria metas financeiras com acompanhamento de progresso. A autenticação é feita via NextAuth (credenciais ou OAuth) com dados persistidos no Supabase (Postgres). A aba "Chat IA" já está disponível na navegação e receberá em breve um assistente financeiro construído com o Vercel AI SDK.',
    goal: 'Centralizar o controle financeiro pessoal em uma interface moderna e, com a IA integrada, transformar dados de transações em insights e recomendações automáticas sobre hábitos de consumo e metas.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'NextAuth.js', 'Vercel AI SDK'],
    repo: 'https://github.com/WalterdesJunior/APP-WEB-GEST-O-FINANCEIRA-COM-IA-INTEGRADA',
    images: [
      'assets/img/webfinanças/dashboard.png',
      'assets/img/webfinanças/transações.png',
      'assets/img/webfinanças/novatransação.png',
      'assets/img/webfinanças/metasfin.png',
      'assets/img/webfinanças/novametafin.png'
    ]
  },
  simulador: {
    emoji: '🗑',
    heroImage: 'assets/img/simuladorcoletadelixo/mapa.png',
    title: 'Simulador de Coleta de Lixo',
    tags: ['Java', 'Swing', 'Estruturas de Dados'],
    desc: 'Simulação em Java da logística de coleta de lixo urbano, dividida em zonas (Sul, Norte, Centro, Leste, Sudeste) atendidas por caminhões pequenos e grandes via estações de transferência, com visualização gráfica em tempo real construída com Swing e JFreeChart.',
    how: 'O sistema modela zonas, caminhões e estações de transferência usando estruturas de dados implementadas do zero (fila e lista encadeada), simulando a geração de lixo, o transporte até as estações e o envio ao aterro em threads concorrentes. A interface Swing exibe a simulação em tempo real com gráficos de tempo de espera e volume de lixo via JFreeChart.',
    goal: 'Aplicar na prática estruturas de dados (filas, listas encadeadas) e programação concorrente em um problema real de logística urbana, servindo como projeto acadêmico de Estrutura de Dados.',
    tech: ['Java', 'Swing', 'JFreeChart', 'Multithreading', 'Filas', 'Listas Encadeadas'],
    repo: 'https://github.com/WalterdesJunior/Simulador-de-Coleta-de-Lixo',
    images: [
      'assets/img/simuladorcoletadelixo/mapa.png',
      'assets/img/simuladorcoletadelixo/caminhoes.png',
      'assets/img/simuladorcoletadelixo/zonas.png',
      'assets/img/simuladorcoletadelixo/caminhoesinfo.png',
      'assets/img/simuladorcoletadelixo/estacoes.png',
      'assets/img/simuladorcoletadelixo/configuracao.png'
    ]
  },
  landing: {
    emoji: '🏠',
    heroImage: 'assets/img/portfoliocorretora/image.png',
    title: 'Landing Page — Corretora de Seguros',
    tags: ['Web', 'HTML/CSS', 'JavaScript'],
    demo: 'https://walterdesjunior.github.io/PORTFOLIO-CORRETORADESEGUROS/',
    desc: 'Página de apresentação profissional e totalmente responsiva desenvolvida para a DM Corretora de Seguros. Conta com design moderno, animações suaves e seções estratégicas pensadas para conversão e geração de leads.',
    how: 'Construída com HTML5, CSS3 e JavaScript puro, sem dependências de frameworks. Inclui animações de scroll, formulário de contato, galeria de serviços e seção de depoimentos. Otimizada para performance em mobile e desktop.',
    goal: 'Aumentar a presença digital da DM Corretora de Seguros, transmitindo credibilidade e profissionalismo, facilitando o contato de potenciais clientes através de um design atraente e intuitivo.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'CSS Animations'],
    images: [
      'assets/img/portfoliocorretora/image.png',
      'assets/img/portfoliocorretora/sobrenós.png',
      'assets/img/portfoliocorretora/serviços.png',
      'assets/img/portfoliocorretora/contato.png'
    ]
  }
};

/* ━━ PROJECT MODAL ━━━━━━━━━━━━━━━━━━━━━━━━ */
function openProject(id) {
  const p = PROJECT_DATA[id];
  if (!p) return;

  const hero = document.getElementById('pmodal-hero');
  const heroEmoji = document.getElementById('pmodal-emoji');
  const heroImage = document.getElementById('pmodal-hero-img');
  const heroVideo = document.getElementById('pmodal-hero-video');
  const heroTrio = document.getElementById('pmodal-hero-trio');
  hero.classList.toggle('pmodal-hero--video', !!p.video);
  hero.classList.toggle('pmodal-hero--img', !p.video && !!p.heroImage);
  hero.classList.toggle('pmodal-hero--trio', !p.video && !p.heroImage && !!p.heroTrio);
  if (p.video) {
    heroEmoji.hidden = true;
    heroImage.hidden = true;
    heroTrio.hidden = true;
    heroVideo.hidden = false;
    if (heroVideo.dataset.src !== p.video) {
      heroVideo.src = p.video;
      heroVideo.dataset.src = p.video;
    }
    heroVideo.play().catch(() => {});
  } else {
    heroVideo.hidden = true;
    heroVideo.pause();
    heroVideo.removeAttribute('src');
    delete heroVideo.dataset.src;
    if (p.heroImage) {
      heroEmoji.hidden = true;
      heroTrio.hidden = true;
      heroImage.hidden = false;
      heroImage.style.aspectRatio = '';
      heroImage.onload = () => {
        heroImage.style.aspectRatio = `${heroImage.naturalWidth} / ${heroImage.naturalHeight}`;
      };
      heroImage.src = p.heroImage;
      heroImage.alt = p.title;
    } else if (p.heroTrio) {
      heroEmoji.hidden = true;
      heroImage.hidden = true;
      heroTrio.hidden = false;
      p.heroTrio.forEach((src, i) => {
        const img = document.getElementById(`pmodal-trio-${i + 1}`);
        img.src = src;
        img.alt = p.title;
      });
    } else {
      heroImage.hidden = true;
      heroImage.removeAttribute('src');
      heroTrio.hidden = true;
      heroEmoji.hidden = false;
      heroEmoji.textContent = p.emoji;
    }
  }
  document.getElementById('pmodal-title').textContent = p.title;
  document.getElementById('pmodal-tags').innerHTML = p.tags.map(t => `<span class="pmodal-tag">${t}</span>`).join('');
  document.getElementById('pmodal-desc').textContent = p.desc;
  document.getElementById('pmodal-tech').innerHTML = p.tech.map(t => `<span class="pmodal-tech-pill">${t}</span>`).join('');

  const features = `${p.how} ${p.goal}`
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 8)
    .slice(0, 5);
  document.getElementById('pmodal-features').innerHTML = features.map(f => `<li>${f}</li>`).join('');
  document.getElementById('pmodal-stat-tech').textContent = p.tech.length;
  document.getElementById('pmodal-stat-feat').textContent = features.length;

  const repoWrap = document.getElementById('pmodal-repo-wrap');
  const repoLink = document.getElementById('pmodal-repo');
  const demoLink = document.getElementById('pmodal-demo');
  repoLink.hidden = !p.repo;
  if (p.repo) repoLink.href = p.repo;
  demoLink.hidden = !p.demo;
  if (p.demo) demoLink.href = p.demo;
  repoWrap.style.display = (p.repo || p.demo) ? 'flex' : 'none';

  const gallery = document.getElementById('pmodal-gallery');
  gallery.classList.toggle('pmodal-gallery--phone', p.device === 'phone');
  if (p.images && p.images.length > 0) {
    gallery.innerHTML = p.images.map(src =>
      p.device === 'phone'
        ? `<div class="pmodal-img pmodal-img--phone"><div class="phone-frame-screen" onclick="openLightbox('${src}')"><img src="${src}" alt="screenshot"/></div></div>`
        : `<div class="pmodal-img"><img src="${src}" alt="screenshot" onclick="openLightbox('${src}')"/></div>`
    ).join('');
  } else {
    gallery.innerHTML = '<p class="pmodal-no-img">📷 Screenshots serão adicionados em breve</p>';
  }

  const overlay = document.getElementById('proj-modal');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.pmodal-box').scrollTop = 0;
}

function closeProject() {
  document.getElementById('proj-modal').classList.remove('open');
  document.body.style.overflow = '';
  document.getElementById('pmodal-hero-video').pause();
}

document.getElementById('proj-modal').addEventListener('click', function(e) {
  if (e.target === this) closeProject();
});

function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('proj-lightbox').classList.add('open');
}

function closeLightbox() {
  document.getElementById('proj-lightbox').classList.remove('open');
}

document.getElementById('proj-lightbox').addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});
