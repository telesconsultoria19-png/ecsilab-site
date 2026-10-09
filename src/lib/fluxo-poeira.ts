/**
 * Ponte entre a poeira cósmica da hero (ovelha de partículas) e a animação da Teoria das Restrições.
 * O tubo publica a posição de cada bolinha; a poeira, ao rolar a página, voa até essas posições e vira as bolinhas.
 * `vis` é o quanto as bolinhas do tubo já aparecem (0 = só a poeira, 1 = bolinhas normais).
 */
export const MAX_BOLINHAS = 1400;

export const fluxo = {
  n: 0,
  ids: new Int32Array(MAX_BOLINHAS),
  /** posição no canvas do tubo (px CSS), relativa ao canto superior esquerdo do tubo */
  xs: new Float32Array(MAX_BOLINHAS),
  ys: new Float32Array(MAX_BOLINHAS),
  raio: 3,
  vis: 1,
};
