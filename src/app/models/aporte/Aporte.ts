import {Acao} from "../acao/Acao";
import {TituloPublico} from "../titulo-publico/TituloPublico";

export interface Aporte{
  id?: number;
  acao?: Acao;
  tituloPublico?: TituloPublico;
  preco?: number;
  quantidade?: number;
  movimentacao?: string;
  dataRegistro?: Date;
}
