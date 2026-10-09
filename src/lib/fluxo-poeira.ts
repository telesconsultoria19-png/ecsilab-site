/**
 * Ponte entre a poeira cósmica da hero (ovelha de partículas) e a animação da Teoria das Restrições.
 * O tubo informa onde ficam a entrada e a saída dele; ao rolar a página, a poeira da hero é sugada para a entrada
 * (ou sai pela saída, ao voltar) e `vis` diz o quanto o fluxo de poeira dentro do tubo já aparece (0 a 1).
 */
export const fluxo = {
  /** intensidade da poeira que corre no tubo (0 = tubo vazio, 1 = fluxo completo) */
  vis: 1,
  /** entrada e saída do tubo, em px CSS relativos ao canto superior esquerdo do canvas do tubo */
  entradaX: 0,
  entradaY: 0,
  saidaX: 0,
  saidaY: 0,
  /** meia-largura da primeira zona e raio de uma bolinha, em px */
  larguraEntrada: 40,
  raio: 3,
};
