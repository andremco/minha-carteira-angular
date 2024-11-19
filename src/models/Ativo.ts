import {Setor} from "./setor/Setor";

export interface Ativo{
  id?: number;
  setor?: Setor;
  quantidade? : number;
  nota? : number;
  dataRegistro? : Date;
  comprarOuAguardar?: string;
  lucroOuPerda?: string;
}
