import {Ativo} from "./Ativo";

export interface Acao extends Ativo {
  razaoSocial? : string
  ticker? : string
  precoDinamico?: number;
  ehFIIs? : boolean;
}
