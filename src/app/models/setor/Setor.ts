import {Dominio} from "../Dominio";
import {TipoAtivo} from "../ativo/TipoAtivo";

export interface Setor extends Dominio{
  tipoAtivo?: TipoAtivo,
  dataRegistro?: string;
  numAtivos?: number;
}
