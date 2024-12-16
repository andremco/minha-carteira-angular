export interface Aporte{
  id?: number;
  acaoId?: number;
  razaoSocial? : string;
  tituloPublicoId?: number;
  descricao?: string;
  preco?: number;
  quantidade?: number;
  movimentacao?: string;
  dataRegistro?: Date;
}
