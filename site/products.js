/* =========================================================
   PRODUTOS.JS — o ÚNICO arquivo que você edita no dia a dia
   ---------------------------------------------------------
   • ADICIONAR: copie um bloco { ... }, cole antes do ] e edite.
   • REMOVER:   apague o bloco { ... } inteiro.
   • PAUSAR:    disponivel: false  → some do site sem apagar nada.
   ========================================================= */

const LOJA = {
  whatsapp: "5511999999999", // código do país + DDD + número, só dígitos
};

const PRODUTOS = [
  {
    nome: "Bateria 60Ah",
    modelo: "Modelo X",
    preco: "R$ 350,00",
    categoria: "sedan",          // sedan | suv | compacto
    amperagem: "60",             // valor usado no filtro de amperagem
    tags: ["mais-vendida"],      // promocao | mais-vendida | diesel
    imagem: "img/bateria-1.webp",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "60Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "500A"],
      ["Dimensões", "242 × 175 × 190 mm"],
      ["Peso", "14,5 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "12 meses"],
      ["Aplicação", "Sedãs e carros médios"],
    ],
  },
  {
    nome: "Bateria 75Ah",
    modelo: "Modelo Pro",
    preco: "R$ 480,00",
    categoria: "suv",
    amperagem: "75",
    tags: ["diesel"],
    imagem: "img/bateria-2.webp",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "75Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "630A"],
      ["Dimensões", "278 × 175 × 190 mm"],
      ["Peso", "17,8 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "18 meses"],
      ["Aplicação", "SUVs, picapes e diesel"],
    ],
  },
  {
    nome: "Bateria 45Ah",
    modelo: "Modelo Compact",
    preco: "R$ 290,00",
    categoria: "compacto",
    amperagem: "45",
    tags: ["promocao"],
    imagem: "img/bateria-3.jpg",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "45Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "330A"],
      ["Dimensões", "207 × 175 × 175 mm"],
      ["Peso", "11,2 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "12 meses"],
      ["Aplicação", "Compactos e populares"],
    ],
  },
  {
    nome: "Bateria 60Ah",
    modelo: "Modelo X",
    preco: "R$ 350,00",
    categoria: "sedan",          // sedan | suv | compacto
    amperagem: "60",             // valor usado no filtro de amperagem
    tags: ["mais-vendida"],      // promocao | mais-vendida | diesel
    imagem: "img/bateria-1.webp",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "60Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "500A"],
      ["Dimensões", "242 × 175 × 190 mm"],
      ["Peso", "14,5 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "12 meses"],
      ["Aplicação", "Sedãs e carros médios"],
    ],
  },
  {
    nome: "Bateria 60Ah",
    modelo: "Modelo X",
    preco: "R$ 350,00",
    categoria: "sedan",          // sedan | suv | compacto
    amperagem: "60",             // valor usado no filtro de amperagem
    tags: ["mais-vendida"],      // promocao | mais-vendida | diesel
    imagem: "img/bateria-1.webp",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "60Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "500A"],
      ["Dimensões", "242 × 175 × 190 mm"],
      ["Peso", "14,5 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "12 meses"],
      ["Aplicação", "Sedãs e carros médios"],
    ],
  },
  {
    nome: "Bateria 60Ah",
    modelo: "Modelo X",
    preco: "R$ 350,00",
    categoria: "sedan",          // sedan | suv | compacto
    amperagem: "60",             // valor usado no filtro de amperagem
    tags: ["mais-vendida"],      // promocao | mais-vendida | diesel
    imagem: "img/bateria-1.webp",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "60Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "500A"],
      ["Dimensões", "242 × 175 × 190 mm"],
      ["Peso", "14,5 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "12 meses"],
      ["Aplicação", "Sedãs e carros médios"],
    ],
  },
  {
    nome: "Bateria 60Ah",
    modelo: "Modelo X",
    preco: "R$ 350,00",
    categoria: "sedan",          // sedan | suv | compacto
    amperagem: "60",             // valor usado no filtro de amperagem
    tags: ["mais-vendida"],      // promocao | mais-vendida | diesel
    imagem: "img/bateria-1.webp",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "60Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "500A"],
      ["Dimensões", "242 × 175 × 190 mm"],
      ["Peso", "14,5 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "12 meses"],
      ["Aplicação", "Sedãs e carros médios"],
    ],
  },
  {
    nome: "Bateria 60Ah",
    modelo: "Modelo X",
    preco: "R$ 350,00",
    categoria: "sedan",          // sedan | suv | compacto
    amperagem: "60",             // valor usado no filtro de amperagem
    tags: ["mais-vendida"],      // promocao | mais-vendida | diesel
    imagem: "img/bateria-1.webp",
    disponivel: true,
    especificacoes: [
      ["Amperagem", "60Ah"],
      ["Tensão", "12V"],
      ["CCA (partida a frio)", "500A"],
      ["Dimensões", "242 × 175 × 190 mm"],
      ["Peso", "14,5 kg"],
      ["Tipo", "Selada (livre de manutenção)"],
      ["Garantia", "12 meses"],
      ["Aplicação", "Sedãs e carros médios"],
    ],
  },
];
