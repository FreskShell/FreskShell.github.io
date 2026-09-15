/* ===== Elementos ===== */
const cards    = [...document.querySelectorAll('.card')];
const busca    = document.getElementById('busca');
const contador = document.getElementById('contador');
const vazio    = document.getElementById('vazio');

const painel       = document.getElementById('painel-filtros');
const botaoFiltros = document.getElementById('botao-filtros');
const badge        = document.getElementById('qtd-filtros');
const chips        = [...document.querySelectorAll('.chip')];
const limpar       = document.getElementById('limpar-filtros');

/* ===== Estado ===== */
/* Cada grupo guarda os valores selecionados.
   Dentro do mesmo grupo vale OU; entre grupos vale E. */
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

/* ===== Filtragem animada com a técnica FLIP =====
   F  First  : mede onde cada card está
   (aplica a mudança de layout — os cards "teleportam")
   L  Last   : mede onde cada card ficou
   I  Invert : aplica transform para parecer que ainda está no lugar antigo
   P  Play   : anima o transform até zero — o card desliza */
function aplicar() {
  const vaoSair = [], vaoEntrar = [], ficam = [];

  cards.forEach(card => {
    const visivel = !card.classList.contains('oculto');
    const passa = cardPassa(card);
    if (visivel && !passa) vaoSair.push(card);
    else if (!visivel && passa) vaoEntrar.push(card);
    else if (visivel && passa) ficam.push(card);
  });

  /* F: posição de tudo que está visível agora */
  const antes = new Map();
  [...vaoSair, ...ficam].forEach(c => antes.set(c, c.getBoundingClientRect()));

  const concluir = () => {
    vaoSair.forEach(c => c.classList.add('oculto'));
    vaoEntrar.forEach(c => c.classList.remove('oculto'));

    /* L: novas posições (getBoundingClientRect força o navegador a calcular o layout) */
    const depois = new Map();
    [...vaoEntrar, ...ficam].forEach(c => depois.set(c, c.getBoundingClientRect()));

    /* I + P: cards que permanecem deslizam do lugar antigo para o novo */
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

    /* Cards que entram: surgem com fade + leve subida */
    vaoEntrar.forEach(card => {
      card.getAnimations().forEach(a => a.cancel()); // limpa resquícios da animação de saída
      card.animate(
        [{ opacity: 0, transform: 'translateY(14px) scale(0.94)' }, { opacity: 1, transform: 'none' }],
        { duration: 280, easing: 'ease-out' }
      );
    });

    atualizarRodape();
  };

  if (vaoSair.length) {
    /* display: none não anima. Por isso o card que sai
       esmaece primeiro e só é escondido no final. */
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

/* Debounce: espera o usuário parar de digitar (250ms)
   para não disparar dezenas de animações sobrepostas */
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

/* Celular não tem hover: o toque expande o card */
if (window.matchMedia('(hover: none)').matches) {
  cards.forEach(card => card.addEventListener('click', (evento) => {
    if (evento.target.closest('a')) return;
    card.classList.toggle('aberta');
  }));
}

atualizarRodape();
