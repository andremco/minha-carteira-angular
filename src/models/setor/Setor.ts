import {Dominio} from "../Dominio";

export interface Setor extends Dominio{
  dataRegistro?: string;
  numAtivos?: number;
}
