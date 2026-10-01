/* ===== Montagem dos cards a partir dos dados (products.js) ===== */
function linkWhatsapp(produto) {
  const nomeCompleto = `${produto.nome} ${produto.modelo}`;
  const mensagem = `Olá! Vi a ${nomeCompleto} no site e quero mais informações.`;
  return `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

function criarCard(produto, indice) {
  // Normaliza na fronteira: espaços invisíveis nos dados não quebram nada
  const nome      = produto.nome.trim();
  const modelo    = produto.modelo.trim();
  const preco     = produto.preco.trim();
  const imagem    = produto.imagem.trim();
  const categoria = produto.categoria.trim();
  const amperagem = produto.amperagem.trim();
  const tags      = produto.tags.map(t => t.trim());

  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.categoria = categoria;
  card.dataset.amperagem = amperagem;
  card.dataset.tags = tags.join(' ');
  card.style.setProperty('--i', indice);

  const specs = produto.especificacoes
    .map(([rotulo, valor]) => `<li><strong>${rotulo.trim()}</strong> ${valor.trim()}</li>`)
    .join('');

  card.innerHTML = `
    <figure class="media">
      <img src="${imagem}" alt="${nome} ${modelo}" loading="lazy"
           onerror="this.onerror=null; this.src='img/noBatteryFound.png'">
    </figure>
    <div class="info">
      <h2>${nome} <span>${modelo}</span></h2>
      <p class="preco">${preco}</p>
    </div>
    <div class="specs" tabindex="0">
      <ul>${specs}</ul>
    </div>
    <a class="zap" target="_blank" rel="noopener" href="${linkWhatsapp({ nome, modelo })}">
      Pedir no WhatsApp
    </a>
  `;
  return card;
}

/* ===== Grade e colunas independentes (masonry) ===== */
const grade = document.getElementById('grade');
const cards = PRODUTOS
  .filter(produto => produto.disponivel)
  .map((produto, indice) => criarCard(produto, indice));

const GAP = 22;
const LARGURA_MIN = 270;
let colunasAtuais = 0;
let primeiraDistribuicao = true;
let colunas = [];

function qtdColunas() {
  const largura = grade.clientWidth;
  return Math.max(1, Math.floor((largura + GAP) / (LARGURA_MIN + GAP)));
}

function construirColunas(qtd) {
  colunasAtuais = qtd;
  grade.textContent = '';
  colunas = [];
  for (let i = 0; i < qtd; i++) {
    const coluna = document.createElement('div');
    coluna.className = 'coluna';
    grade.appendChild(coluna);
    colunas.push(coluna);
  }
}

/* Reempacota SOMENTE os visíveis, em ordem de leitura. */
function empacotar() {
  const qtd = qtdColunas();
  if (qtd !== colunasAtuais) construirColunas(qtd);
  if (!primeiraDistribuicao) grade.classList.add('sem-entrada');
  primeiraDistribuicao = false;

  const visiveis = cards.filter(c => !c.classList.contains('oculto'));
  visiveis.forEach((card, i) => colunas[i % qtd].appendChild(card));
}

empacotar();

let tempoResize;
window.addEventListener('resize', () => {
  clearTimeout(tempoResize);
  tempoResize = setTimeout(empacotar, 150);
});

/* ===== Elementos ===== */
const busca    = document.getElementById('busca');
const contador = document.getElementById('contador');
const vazio    = document.getElementById('vazio');
const painel       = document.getElementById('painel-filtros');
const botaoFiltros = document.getElementById('botao-filtros');
const badge        = document.getElementById('qtd-filtros');
const chips        = [...document.querySelectorAll('.chip')];
const limpar       = document.getElementById('limpar-filtros');

/* ===== Estado ===== */
const ativos = { categoria: new Set(), amperagem: new Set(), tag: new Set() };
let termoAtual = '';

/* ===== Utilitários ===== */
const normalizar = (texto) => texto
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

function cardPassa(card) {
  if (termoAtual) {
    const alvo = normalizar(
      card.textContent + ' ' + card.dataset.categoria + ' ' +
      card.dataset.amperagem + 'ah ' + card.dataset.tags
    );
    if (!alvo.includes(termoAtual)) return false;
  }
  if (ativos.categoria.size && !ativos.categoria.has(card.dataset.categoria)) return false;
  if (ativos.amperagem.size && !ativos.amperagem.has(card.dataset.amperagem)) return false;
  if (ativos.tag.size && !card.dataset.tags.split(' ').some(t => ativos.tag.has(t))) return false;
  return true;
}

function atualizarRodape() {
  const visiveis = cards.filter(c => !c.classList.contains('oculto')).length;
  contador.textContent = visiveis === 1 ? '1 produto exibido' : visiveis + ' produtos exibidos';
  vazio.hidden = visiveis !== 0;
}

function atualizarBadge() {
  const total = ativos.categoria.size + ativos.amperagem.size + ativos.tag.size;
  badge.hidden = total === 0;
  badge.textContent = total;
}

/* ===== Filtragem animada (FLIP) ===== */
function aplicar() {
  const vaoSair = [], vaoEntrar = [], ficam = [];

  cards.forEach(card => {
    const visivel = !card.classList.contains('oculto');
    const passa = cardPassa(card);
    if (visivel && !passa) vaoSair.push(card);
    else if (!visivel && passa) vaoEntrar.push(card);
    else if (visivel && passa) ficam.push(card);
  });

  const antes = new Map();
  [...vaoSair, ...ficam].forEach(c => antes.set(c, c.getBoundingClientRect()));

  const concluir = () => {
    vaoSair.forEach(c => c.classList.add('oculto'));
    vaoEntrar.forEach(c => c.classList.remove('oculto'));

    empacotar(); // reflow em lista: vale para filtros E para pesquisa

    const depois = new Map();
    [...vaoEntrar, ...ficam].forEach(c => depois.set(c, c.getBoundingClientRect()));

    ficam.forEach(card => {
      const a = antes.get(card), d = depois.get(card);
      const dx = a.left - d.left, dy = a.top - d.top;
      if (dx || dy) {
        card.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
          { duration: 320, easing: 'cubic-bezier(0.25, 0.8, 0.35, 1)' }
        );
      }
    });

    vaoEntrar.forEach(card => {
      card.getAnimations().forEach(a => a.cancel());
      card.animate(
        [{ opacity: 0, transform: 'translateY(14px) scale(0.94)' }, { opacity: 1, transform: 'none' }],
        { duration: 280, easing: 'ease-out' }
      );
    });

    atualizarRodape();
  };

  if (vaoSair.length) {
    let faltam = vaoSair.length;
    vaoSair.forEach(card => {
      card.getAnimations().forEach(a => a.cancel());
      const anim = card.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.88)' }],
        { duration: 200, easing: 'ease-in', fill: 'forwards' }
      );
      anim.onfinish = () => { if (--faltam === 0) concluir(); };
    });
  } else {
    concluir();
  }
}

/* ===== Eventos ===== */
let tempoBusca;
busca.addEventListener('input', () => {
  clearTimeout(tempoBusca);
  tempoBusca = setTimeout(() => {
    termoAtual = normalizar(busca.value.trim());
    aplicar();
  }, 250);
});

chips.forEach(chip => chip.addEventListener('click', () => {
  const grupo = chip.dataset.grupo;
  const valor = chip.dataset.valor;
  if (ativos[grupo].has(valor)) {
    ativos[grupo].delete(valor);
  } else {
    ativos[grupo].add(valor);
  }
  chip.classList.toggle('ativo');
  atualizarBadge();
  aplicar();
}));

botaoFiltros.addEventListener('click', () => {
  const aberto = painel.classList.toggle('aberto');
  botaoFiltros.setAttribute('aria-expanded', String(aberto));
});

limpar.addEventListener('click', () => {
  Object.values(ativos).forEach(s => s.clear());
  chips.forEach(c => c.classList.remove('ativo'));
  atualizarBadge();
  aplicar();
});

/* Um toque/clique no card abre; um segundo toque/clique fecha.
   Cada card é independente: vários podem ficar abertos ao mesmo tempo. */
cards.forEach(card => {
  const specs = card.querySelector('.specs');
  card.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) return; // o link do WhatsApp não alterna
    card.classList.toggle('aberta');
    if (specs.contains(document.activeElement)) specs.blur();
  });
});

atualizarRodape();
