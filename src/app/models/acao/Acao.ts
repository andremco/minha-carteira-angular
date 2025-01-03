import {Ativo} from "src/app/models/ativo/Ativo";
import {TipoAtivo} from "../ativo/TipoAtivo";

export interface Acao extends Ativo {
  razaoSocial? : string;
  ticker? : string;
  precoDinamico?: number;
}
