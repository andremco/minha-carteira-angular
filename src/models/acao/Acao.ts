import {Ativo} from "src/models/Ativo";

export interface Acao extends Ativo {
  razaoSocial? : string;
  categoriaId?: number;
  categoriaDescricao?: string;
  ticker? : string;
  precoDinamico?: number;
}
