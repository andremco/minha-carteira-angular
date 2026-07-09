import {Acao} from "../acao/Acao";
import {Moeda} from "../moeda/Moeda";
import {TituloPublico} from "../titulo-publico/TituloPublico";

export interface Aporte{
  id?: number;
  acao?: Acao;
  tituloPublico?: TituloPublico;
  Moeda?: Moeda;
  preco?: number;
  quantidade?: number;
  movimentacao?: string;
  dataRegistro?: Date;
}
