/** Canal de WhatsApp da Écsilab. Troque o número só aqui (DDI + DDD + número, sem símbolos). */
export const WHATSAPP_NUMERO = "5596984292017";

export const WHATSAPP_MENSAGEM =
  "Olá! Vim pelo site da Écsilab e quero conversar sobre o meu negócio.";

export const WHATSAPP_EXIBICAO = "(96) 98429-2017";

export function linkWhatsApp(mensagem: string = WHATSAPP_MENSAGEM) {
  return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
}
