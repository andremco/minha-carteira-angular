export interface Aporte{
  id?: number;
  acaoId?: number;
  razaoSocial? : string;
  tituloPublicoId?: number;
  descricao?: string;
  preco: number | null;
  quantidade: number | null;
  movimentacao?: string;
  dataRegistro?: Date;
}
