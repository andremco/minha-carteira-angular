import {Ativo} from "src/app/models/ativo/Ativo";

export interface Moeda extends Ativo {
  nome?: string;
  codigo?: string;
  precoDinamico?: number;
}
