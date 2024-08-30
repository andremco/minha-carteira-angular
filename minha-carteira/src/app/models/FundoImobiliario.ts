import {Ativo} from "./Ativo";

export interface FundoImobiliario extends Ativo {
  razaoSocial? : string
  ticker? : string
  precoDinamico?: number;
}
