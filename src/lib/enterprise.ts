// Conteúdo da página Écsilab Enterprise: implantação de departamentos inteiros com IA,
// em que a infraestrutura fica em nome da empresa cliente.
// Nomes próprios (Lexia, Alfredo, Redil...) vêm do portfólio da Écsilab; onde não há nome próprio, a função é descrita em português.

export type Departamento = {
  id: string;
  nome: string;
  grupo: "corporativo" | "vertical";
  resumo: string;
  /** Cada item: [nome em destaque (ou vazio), descrição]. */
  componentes: Array<[string, string]>;
};

export const DEPARTAMENTOS: Departamento[] = [
  {
    id: "vendas",
    nome: "Time de Vendas Autônomo",
    grupo: "corporativo",
    resumo:
      "Prospecção, qualificação, CRM e treino do time comercial funcionando juntos, do primeiro contato ao fechamento.",
    componentes: [
      ["Lexia", "SDR com IA no WhatsApp, qualificando contatos 24 horas por dia"],
      ["Alfredo", "diretor comercial autônomo"],
      ["", "Disparo de campanhas no WhatsApp oficial"],
      ["Redil", "CRM pronto para uso"],
      ["", "Vídeos de prospecção com IA"],
      ["Arena", "simulador de vendas para treino contínuo"],
      ["Códice", "playbook com funil, scripts e objeções"],
    ],
  },
  {
    id: "marketing",
    nome: "Diretoria de Marketing Autônoma",
    grupo: "corporativo",
    resumo:
      "Mídia paga, redes sociais e criativos num único painel, com um diretor de marketing de IA conduzindo a operação.",
    componentes: [
      ["Maestro", "diretor de marketing autônomo"],
      ["", "Gestão de Google Ads com IA"],
      ["Alvo", "gestão de tráfego no Meta Ads"],
      ["", "Governança de UTMs, para saber de onde cada resultado vem"],
      ["", "Automação de redes sociais"],
      ["", "Gestão de conteúdo social com IA"],
      ["", "Criativos e vídeos com IA"],
    ],
  },
  {
    id: "atendimento",
    nome: "Central de Atendimento e CS Autônoma",
    grupo: "corporativo",
    resumo:
      "A jornada pós-venda inteira: da primeira mensagem no WhatsApp até a pesquisa de satisfação e a reputação.",
    componentes: [
      ["Malha", "atendimento multiagentes no WhatsApp"],
      ["", "Central de ajuda (helpdesk) com IA"],
      ["", "Portal do cliente"],
      ["", "Onboarding e CS com IA"],
      ["Bússola", "pesquisa de satisfação (NPS) automatizada"],
      ["Vigia", "monitoramento de reputação e avaliações"],
      ["Síntese", "resumo de conversas do WhatsApp"],
    ],
  },
  {
    id: "financeiro",
    nome: "Departamento Financeiro Autônomo",
    grupo: "corporativo",
    resumo:
      "Fluxo de caixa, cobrança, precificação e análise de risco organizados, sem depender de uma estrutura financeira pesada.",
    componentes: [
      ["", "Diretor financeiro (CFO) autônomo"],
      ["", "ERP financeiro com IA"],
      ["Cofre", "central financeira: contas a pagar, orçamento e caixa"],
      ["Régua", "precificação inteligente de produtos e serviços"],
      ["Retorno", "cobrança automática"],
      ["", "Análise de risco de crédito por CNPJ"],
    ],
  },
  {
    id: "rh",
    nome: "Núcleo de RH Autônomo",
    grupo: "corporativo",
    resumo:
      "Recrutamento, onboarding e desenvolvimento das pessoas, para o time crescer sem que o RH vire gargalo.",
    componentes: [
      ["", "SDR de recrutamento"],
      ["", "Recrutamento com IA, da triagem à seleção"],
      ["", "Gestão de RH completa com IA"],
      ["", "Onboarding de colaboradores"],
      ["Degrau", "plano de desenvolvimento individual"],
      ["Norte", "gestão de OKRs com IA"],
      ["", "Plataforma de treinamento para colaboradores"],
    ],
  },
  {
    id: "conteudo",
    nome: "Fábrica de Conteúdo Autônoma",
    grupo: "corporativo",
    resumo:
      "Um estúdio de conteúdo com IA: a empresa entrega a matéria-prima e recebe posts, cortes e artigos prontos.",
    componentes: [
      ["", "Automação de redes sociais"],
      ["", "Gestão de social media com IA"],
      ["", "Produção de vídeos com IA"],
      ["", "Cortes de vídeo para redes"],
      ["", "Vídeos cinematográficos com IA"],
      ["Tinta", "artigos de blog com IA"],
      ["Ponte", "fluxos conversacionais para captar contatos"],
    ],
  },
  {
    id: "juridico",
    nome: "Escritório Jurídico Autônomo",
    grupo: "vertical",
    resumo:
      "Um escritório de advocacia digital: capta, qualifica, peticiona, assina e acompanha publicações.",
    componentes: [
      ["", "Jurisprudência de vários tribunais com IA"],
      ["", "Peticionamento com IA"],
      ["", "CRM jurídico"],
      ["", "SDR e qualificação no WhatsApp para escritórios"],
      ["Selo", "assinatura digital de contratos"],
      ["", "Scanner de Diário Oficial"],
    ],
  },
  {
    id: "imobiliario",
    nome: "Ecossistema Imobiliário 360°",
    grupo: "vertical",
    resumo: "Uma corretora autônoma: do lead no portal à gestão da carteira de imóveis.",
    componentes: [
      ["", "SDR imobiliário no WhatsApp e por voz"],
      ["", "CRM imobiliário"],
      ["", "Prospecção de leads em portais de imóveis"],
      ["Horizonte", "painel preditivo de metas"],
      ["", "Gerador de anúncios e e-mail marketing de imóveis"],
      ["", "Qualificação de leads imobiliários"],
      ["", "Gestão da carteira de imóveis"],
    ],
  },
  {
    id: "saude-estetica",
    nome: "Ecossistema Saúde & Estética 360°",
    grupo: "vertical",
    resumo:
      "A clínica autônoma: captação, agendamento, relacionamento e reputação num só fluxo.",
    componentes: [
      ["", "SDR para estética e beleza"],
      ["", "SDR para saúde e agendamentos"],
      ["", "SDR por voz para saúde"],
      ["", "Gestão de agenda e da clínica"],
      ["", "CRM de saúde"],
      ["Vigia", "monitoramento de reputação e avaliações"],
      ["", "Acompanhamento nutricional, quando aplicável"],
    ],
  },
  {
    id: "varejo",
    nome: "Ecossistema E-commerce e Varejo Autônomo",
    grupo: "vertical",
    resumo:
      "Do primeiro contato à recompra, para quem vende produto físico, sem depender de uma agência full-service.",
    componentes: [
      ["", "SDR para e-commerce, integrado à loja virtual"],
      ["", "CRM para e-commerce"],
      ["", "Recuperação de carrinho abandonado"],
      ["", "Estúdio fotográfico com IA para varejo"],
      ["", "Monitoramento de preços"],
      ["", "Plataforma de recompra e assinatura"],
    ],
  },
];

export const COMPARATIVO: Array<{ tema: string; assinatura: string; propria: string }> = [
  {
    tema: "Como se paga",
    assinatura: "Mensalidade, para sempre",
    propria: "Projeto com pagamento único",
  },
  {
    tema: "De quem é",
    assinatura: "Da plataforma. Você é só usuário",
    propria: "Sua. Contas, acessos e fluxos em nome da empresa",
  },
  {
    tema: "Onde ficam os dados",
    assinatura: "Na conta do fornecedor",
    propria: "Na infraestrutura da sua empresa",
  },
  {
    tema: "Quem decide a evolução",
    assinatura: "O roteiro do fornecedor",
    propria: "Você, com ou sem a Écsilab",
  },
  {
    tema: "Se você quiser sair",
    assinatura: "Cancelar é perder o que foi construído",
    propria: "Não há o que cancelar: é seu",
  },
];

export const ETAPAS: Array<{ titulo: string; texto: string }> = [
  {
    titulo: "Diagnóstico do departamento",
    texto: "Entendemos como a área funciona hoje, onde está o gargalo e o que vale automatizar primeiro.",
  },
  {
    titulo: "Desenho da solução",
    texto: "Definimos quais soluções entram, como se conectam e o que muda na rotina do time.",
  },
  {
    titulo: "Implantação e testes",
    texto: "Construímos na infraestrutura da sua empresa e testamos com a operação real antes de entregar.",
  },
  {
    titulo: "Documentação e treinamento",
    texto: "Documentamos tudo e treinamos a sua equipe para operar e conduzir o departamento.",
  },
  {
    titulo: "Entrega, rodando e em seu nome",
    texto: "O departamento fica funcionando, com contas, acessos e fluxos em nome da sua empresa.",
  },
];

export const FICA_COM_VOCE = [
  "Contas de infraestrutura em nome da sua empresa",
  "Acessos administrativos completos",
  "Fluxos, automações e configurações",
  "Documentação do projeto",
  "Equipe treinada para operar",
  "Sem mensalidade da Écsilab para continuar funcionando",
];

export const FORA_DO_PROJETO = [
  "Custos de infraestrutura e de APIs de terceiros, pagos por você diretamente aos provedores",
  "Suporte e evolução contínua, que podem ser contratados à parte, se você quiser",
];

export const PARA_QUEM: string[] = [
  "Empresas com uma área sobrecarregada, que cresce mais rápido do que a equipe",
  "Diretorias que querem escalar a operação sem inflar a folha",
  "Quem prefere ser dono da própria infraestrutura a alugar mais uma plataforma",
  "Empresas que já têm processos e querem colocá-los para rodar com IA",
];

export const PERGUNTAS: Array<{ p: string; r: string }> = [
  {
    p: "Existe mensalidade?",
    r: "Não pela Écsilab. A implantação é um projeto com pagamento único. Os custos de infraestrutura e de APIs de terceiros são pagos por você diretamente aos provedores, em contas da sua empresa.",
  },
  {
    p: "A infraestrutura é mesmo minha?",
    r: "Sim. Contas, acessos administrativos, fluxos e configurações ficam em nome da sua empresa. Os termos exatos constam no contrato do projeto.",
  },
  {
    p: "Posso começar por um departamento só?",
    r: "Sim, e é o mais comum. Começamos pela área que mais pesa hoje e expandimos para as demais, no seu ritmo.",
  },
  {
    p: "Quanto custa?",
    r: "O investimento depende do departamento e do escopo. Ele é definido em proposta, depois de uma conversa sobre o seu cenário.",
  },
  {
    p: "Quanto tempo leva?",
    r: "Depende do departamento e das integrações necessárias. Informamos o prazo na proposta.",
  },
  {
    p: "E depois da entrega, preciso de vocês?",
    r: "Não. Suporte e evolução contínua não fazem parte do projeto. Se quiser, podem ser contratados à parte, e a infraestrutura continua sendo sua com ou sem eles.",
  },
  {
    p: "Onde ficam os meus dados?",
    r: "Na infraestrutura da sua empresa, e não na nossa. Os cuidados de segurança e de privacidade fazem parte do desenho do projeto.",
  },
];
