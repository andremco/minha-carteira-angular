import {Ativo} from "src/app/models/ativo/Ativo";

export interface TituloPublico extends Ativo{
  descricao? : string;
  precoInicial? : number;
  valorRendimento? : number;
}
