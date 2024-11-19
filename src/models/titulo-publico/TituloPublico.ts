import {Ativo} from "src/models/Ativo";

export interface TituloPublico extends Ativo{
  descricao? : string;
  precoAjustado? : number;
}
