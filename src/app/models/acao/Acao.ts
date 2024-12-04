import {Ativo} from "src/app/models/Ativo";
import {Categoria} from "./Categoria";

export interface Acao extends Ativo {
  razaoSocial? : string;
  categoria?: Categoria;
  ticker? : string;
  precoDinamico?: number;
}
