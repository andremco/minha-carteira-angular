import {Ativo} from "./Ativo";

export interface TituloPublico extends Ativo{
  descricao? : string
  precoAjustado? : number
}
