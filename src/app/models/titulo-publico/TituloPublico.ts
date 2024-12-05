import {Ativo} from "src/app/models/Ativo";

export interface TituloPublico extends Ativo{
  descricao? : string;
  precoInicial? : number;
}
