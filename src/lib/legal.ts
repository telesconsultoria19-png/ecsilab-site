// Política de Privacidade e Termos de Uso da Écsilab.
// Texto-base redigido a partir do que o site realmente coleta e faz hoje.
// ATENÇÃO: é um rascunho. Revise com um advogado antes de tratar como definitivo.

/** Mude esta data sempre que alterar um dos documentos: o aviso de aceite volta a aparecer para todos. */
export const VERSAO_LEGAL = "2026-10-06";

/**
 * Identificação do responsável. Campos vazios não aparecem nas páginas.
 * A LGPD (art. 9º) pede a identificação completa do controlador: preencha razão social, CNPJ,
 * endereço e e-mail para os pedidos de titulares.
 */
export const RESPONSAVEL = {
  nome: "Écsilab",
  razaoSocial: "Marcelo Teles Barbosa, empresário individual",
  cnpj: "33.861.777/0001-08",
  endereco: "Av. Duque de Caxias, 931, Central, Macapá, AP, CEP 68900-071",
  email: "telesconsultoria19@gmail.com",
  whatsapp: "+55 96 98429-2017",
  site: "ecsilab.com.br",
};

export type SecaoLegal = {
  id: string;
  titulo: string;
  paragrafos?: string[];
  itens?: string[];
  depois?: string[];
};
export type DocumentoLegal = { titulo: string; resumo: string; secoes: SecaoLegal[] };

export const dataLegal = () =>
  new Date(`${VERSAO_LEGAL}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// ── Política de Privacidade ──────────────────────────────────────────────
export const POLITICA: DocumentoLegal = {
  titulo: "Política de Privacidade",
  resumo:
    "Aqui explicamos, com clareza, quais dados pessoais coletamos, por quê, com quem compartilhamos e como você exerce os seus direitos.",
  secoes: [
    {
      id: "quem-somos",
      titulo: "1. Quem somos e a quem esta política se aplica",
      paragrafos: [
        'Esta Política explica como a Écsilab ("nós"), responsável pelo site ecsilab.com.br ("Site"), trata dados pessoais de quem visita o Site, de quem faz o diagnóstico, de quem pede contato ou informações sobre as nossas soluções e de representantes de empresas interessadas nos nossos serviços. O tratamento segue a Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018).',
        `A Écsilab é operada por ${RESPONSAVEL.razaoSocial}, inscrito no CNPJ sob o nº ${RESPONSAVEL.cnpj}, com sede em Macapá, AP.`,
        'Para a LGPD, somos a controladora dos seus dados. Você fala com a nossa equipe sobre privacidade pelos canais da seção "Contato e identificação", no fim desta página.',
      ],
    },
    {
      id: "dados",
      titulo: "2. Quais dados coletamos",
      paragrafos: [
        "Coletamos apenas o que o Site precisa para funcionar, de acordo com o que você faz nele:",
      ],
      itens: [
        "Pedido de contato ou de agendamento do diagnóstico: nome, WhatsApp, nome da empresa, e-mail, faixa de faturamento mensal e o texto livre em que você descreve o seu desafio.",
        "Interesse em uma solução do nosso portfólio: nome, e-mail, WhatsApp, empresa e qual solução despertou o seu interesse.",
        "Diagnóstico de gargalo (quiz): as suas respostas e o resultado. Se você pedir para receber o resultado, também o seu e-mail.",
        "Calculadora CAC × LTV: os valores que você digita são processados no seu próprio navegador. Não os enviamos nem os guardamos.",
        "Registro do seu aceite: a versão desta Política e a data em que você marcou a concordância ao enviar um formulário.",
        "Dados técnicos: endereço IP, tipo de navegador e de dispositivo e páginas acessadas, registrados pelos serviços de hospedagem e segurança. Ao enviar um formulário, guardamos também a página de onde ele foi enviado.",
      ],
      depois: [
        "Não pedimos dados pessoais sensíveis (como saúde, religião ou orientação sexual) nem dados de terceiros. Por favor, não os informe nos campos de texto livre.",
      ],
    },
    {
      id: "finalidades",
      titulo: "3. Para que usamos os dados e em que base legal",
      itens: [
        "Responder ao seu pedido, agendar o diagnóstico e conversar sobre a sua necessidade: execução de procedimentos preliminares a pedido seu (art. 7º, V, da LGPD).",
        "Enviar o resultado do diagnóstico que você solicitou: execução de procedimentos preliminares a pedido seu (art. 7º, V).",
        "Entrar em contato comercial sobre soluções relacionadas ao seu interesse: legítimo interesse (art. 7º, IX). Você pode pedir para não receber mais contatos a qualquer momento.",
        "Manter a segurança do Site, prevenir fraudes e corrigir falhas: legítimo interesse (art. 7º, IX).",
        "Cumprir obrigações legais ou regulatórias, ou atender ordem de autoridade: cumprimento de obrigação legal (art. 7º, II).",
      ],
      depois: [
        "O resultado do diagnóstico é automático e tem caráter informativo. Ele não produz decisão que afete os seus direitos. Não vendemos nem alugamos os seus dados.",
      ],
    },
    {
      id: "compartilhamento",
      titulo: "4. Com quem compartilhamos",
      paragrafos: [
        "Compartilhamos dados somente com quem precisa deles para o Site funcionar e para atender o seu pedido:",
      ],
      itens: [
        "Os sócios e a equipe da Écsilab, que respondem aos pedidos recebidos.",
        "Banco de dados: Supabase, onde os formulários enviados ficam guardados, em servidor na região de São Paulo.",
        "Hospedagem e segurança do Site: Cloudflare.",
        "Envio de e-mails (por exemplo, o aviso interno de novo contato), quando ativo: Resend.",
        "WhatsApp (Meta): quando você decide falar conosco por lá, a conversa passa a seguir as regras do WhatsApp.",
      ],
      depois: [
        "Esses provedores tratam os dados conforme as nossas instruções e para essas finalidades. O WhatsApp tem a sua própria política de privacidade. Também podemos compartilhar dados quando a lei ou uma autoridade exigir.",
      ],
    },
    {
      id: "internacional",
      titulo: "5. Transferência para fora do Brasil",
      paragrafos: [
        "Alguns desses provedores, como a Cloudflare e o Resend, podem processar dados em servidores fora do Brasil. Quando isso acontece, buscamos provedores que ofereçam garantias adequadas de proteção, conforme o art. 33 da LGPD.",
      ],
    },
    {
      id: "cookies",
      titulo: "6. Cookies e tecnologias semelhantes",
      paragrafos: ["Usamos o mínimo necessário. Veja o que existe hoje no Site:"],
      itens: [
        "Armazenamento do navegador: guardamos apenas o registro de que você leu e aceitou este aviso, com a versão aceita.",
        "Segurança: a Cloudflare pode definir cookies técnicos para proteger o Site contra robôs e ataques.",
        "Fontes e imagens: o Site usa as fontes do seu próprio dispositivo e entrega as imagens a partir dos nossos servidores. Não carrega fontes do Google.",
      ],
      depois: [
        'Não usamos cookies de publicidade, de análise de comportamento nem pixels de redes sociais. Se um dia adicionarmos essas ferramentas, pediremos o seu consentimento antes. Em "Preferências de cookies", no rodapé, você reabre o aviso a qualquer momento.',
      ],
    },
    {
      id: "retencao",
      titulo: "7. Por quanto tempo guardamos os dados",
      paragrafos: [
        "Guardamos os pedidos de contato e de informação enquanto houver relacionamento ou interesse legítimo e por até 24 meses após o último contato. Depois disso, eliminamos ou anonimizamos os dados, salvo se a lei exigir que sejam mantidos por mais tempo. Se você pedir a exclusão antes, atendemos o pedido.",
      ],
    },
    {
      id: "seguranca",
      titulo: "8. Como protegemos os dados",
      itens: [
        "Conexão protegida (HTTPS) em todo o Site.",
        "Regras de segurança no banco de dados: o visitante só consegue enviar informações pelos formulários. Ninguém consegue ler os dados de outras pessoas pelo Site.",
        "Acesso aos dados recebidos restrito aos sócios e à equipe, mediante login.",
      ],
      depois: [
        "Nenhum sistema é totalmente imune a falhas. Se ocorrer um incidente que possa causar risco ou dano relevante, avisaremos você e a Autoridade Nacional de Proteção de Dados (ANPD), como a lei determina.",
      ],
    },
    {
      id: "direitos",
      titulo: "9. Os seus direitos",
      paragrafos: ["Pela LGPD (art. 18), você pode pedir a qualquer momento:"],
      itens: [
        "confirmação de que tratamos os seus dados e acesso a eles;",
        "correção de dados incompletos, inexatos ou desatualizados;",
        "anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desacordo com a lei;",
        "portabilidade dos dados;",
        "eliminação dos dados tratados com o seu consentimento;",
        "informação sobre com quem compartilhamos os dados;",
        "informação sobre a possibilidade de não consentir e sobre as consequências;",
        "revogação do consentimento.",
      ],
      depois: [
        'Para exercer qualquer direito, fale conosco pelos canais da seção "Contato e identificação". Respondemos em até 15 dias. Se achar que o tratamento não está correto, você também pode reclamar à ANPD (gov.br/anpd).',
      ],
    },
    {
      id: "menores",
      titulo: "10. Menores de idade",
      paragrafos: [
        "O Site é destinado a empresários e profissionais maiores de 18 anos. Se soubermos que um menor enviou dados, eliminaremos as informações.",
      ],
    },
    {
      id: "links",
      titulo: "11. Links para outros sites",
      paragrafos: [
        "O Site pode ter links para serviços de terceiros, como o WhatsApp. Quando você os acessa, passa a valer a política de privacidade deles, sobre a qual não temos controle.",
      ],
    },
    {
      id: "alteracoes",
      titulo: "12. Mudanças nesta Política",
      paragrafos: [
        "Podemos atualizar esta Política. A data da última versão aparece no topo da página. Quando a mudança for relevante, avisaremos pelo Site e pediremos um novo aceite.",
      ],
    },
  ],
};

// ── Termos de Uso ────────────────────────────────────────────────────────
export const TERMOS: DocumentoLegal = {
  titulo: "Termos de Uso",
  resumo: "As regras para usar o Site e as ferramentas gratuitas da Écsilab, escritas de forma direta.",
  secoes: [
    {
      id: "aceite",
      titulo: "1. Aceite e quem pode usar",
      paragrafos: [
        'Ao usar o Site, fazer o diagnóstico, usar a calculadora, enviar um formulário ou clicar em "Entendi", você declara ter lido e concordado com estes Termos e com a Política de Privacidade. Se não concordar, não use o Site.',
        "O Site é destinado a maiores de 18 anos e com plena capacidade civil, que agem em nome próprio ou de uma empresa que representam.",
      ],
    },
    {
      id: "servico",
      titulo: "2. O que o Site oferece",
      paragrafos: [
        "O Site apresenta a Écsilab, os nossos serviços de growth, marketing e processos, o nosso portfólio de soluções de inteligência artificial e as ferramentas gratuitas de diagnóstico e de cálculo. Ele também reúne os canais para você falar com a gente.",
      ],
    },
    {
      id: "natureza",
      titulo: "3. O que as ferramentas gratuitas são e o que não são",
      paragrafos: [
        "O diagnóstico de gargalo e a calculadora CAC × LTV são ferramentas de orientação, baseadas em informações simplificadas que você mesmo fornece. Os resultados são estimativas para reflexão e não substituem uma análise completa do seu negócio.",
        "Elas não são consultoria financeira, contábil, jurídica ou de investimentos. Por exemplo, a calculadora não considera margem nem cancelamentos de clientes. Decisões importantes devem contar com profissionais habilitados nas áreas correspondentes.",
      ],
    },
    {
      id: "resultados",
      titulo: "4. Sem garantia de resultados",
      paragrafos: [
        "Os casos e números apresentados no Site são recortes reais de projetos específicos, com o contexto indicado em cada um. Cada empresa tem uma realidade diferente, e os resultados dependem de fatores que não controlamos. Por isso, não prometemos resultados específicos, sejam de faturamento, vendas, retorno sobre investimento ou crescimento.",
      ],
    },
    {
      id: "contratacao",
      titulo: "5. Propostas, serviços e soluções",
      paragrafos: [
        "As descrições do portfólio de soluções e dos serviços servem para apresentar o que fazemos. Elas não são uma oferta fechada nem um contrato. Escopo, prazos, valores e condições de cada serviço ou solução constam em proposta ou contrato escrito, que prevalece sobre o texto do Site. Isso não afasta os direitos que o Código de Defesa do Consumidor garante, quando aplicável.",
      ],
    },
    {
      id: "informacoes",
      titulo: "6. Informações que você envia",
      itens: [
        "Informe dados verdadeiros e atualizados.",
        "Não envie dados pessoais sensíveis nem informações de terceiros além do necessário.",
        "Você é responsável pelas informações que envia em nome de uma empresa.",
      ],
    },
    {
      id: "uso",
      titulo: "7. Uso adequado",
      paragrafos: ["Ao usar o Site, você se compromete a não:"],
      itens: [
        "usá-lo para fins ilícitos ou para prejudicar terceiros;",
        "tentar acessar dados de outras pessoas, contornar a segurança ou sobrecarregar o serviço;",
        "enviar formulários automáticos, em massa ou com dados falsos;",
        "copiar, vender ou distribuir o conteúdo, as ferramentas ou os métodos sem autorização.",
      ],
    },
    {
      id: "propriedade",
      titulo: "8. Propriedade intelectual",
      paragrafos: [
        "Os textos, a marca Écsilab, o layout, os nomes das soluções, as ferramentas e os métodos apresentados no Site pertencem à Écsilab ou aos seus licenciantes. Você recebe uma licença pessoal, limitada e intransferível para usar as ferramentas gratuitas e ler o conteúdo, sem direito de reproduzi-los ou explorá-los comercialmente.",
      ],
    },
    {
      id: "disponibilidade",
      titulo: "9. Disponibilidade do Site",
      paragrafos: [
        "Trabalhamos para manter o Site no ar, mas não garantimos funcionamento ininterrupto. Podemos alterar, suspender ou encerrar conteúdos e funcionalidades, inclusive para manutenção.",
      ],
    },
    {
      id: "responsabilidade",
      titulo: "10. Limites de responsabilidade",
      paragrafos: [
        "Na medida permitida em lei, e sem prejuízo dos seus direitos como consumidor, não nos responsabilizamos por decisões que você tome com base no conteúdo ou nos resultados das ferramentas gratuitas, nem por falhas de serviços de terceiros, como internet, hospedagem ou WhatsApp.",
      ],
    },
    {
      id: "terceiros",
      titulo: "11. Links e serviços de terceiros",
      paragrafos: [
        "O Site pode apontar para serviços de terceiros. Eles têm termos e políticas próprios, e não somos responsáveis pelo conteúdo ou pelo funcionamento deles.",
      ],
    },
    {
      id: "privacidade",
      titulo: "12. Privacidade e cookies",
      paragrafos: [
        "O tratamento dos seus dados pessoais e o uso de cookies seguem a Política de Privacidade, que faz parte destes Termos.",
      ],
    },
    {
      id: "mudancas",
      titulo: "13. Mudanças nestes Termos",
      paragrafos: [
        "Podemos atualizar estes Termos. A data da última versão aparece no topo da página, e mudanças relevantes serão avisadas pelo Site, com pedido de novo aceite. Continuar usando o Site depois do aviso significa concordar com a nova versão.",
      ],
    },
    {
      id: "lei",
      titulo: "14. Lei aplicável e foro",
      paragrafos: [
        "Estes Termos seguem a lei brasileira. Havendo relação de consumo, fica eleito o foro do domicílio do consumidor. Nos demais casos, o foro da comarca de Macapá, AP.",
      ],
    },
  ],
};
