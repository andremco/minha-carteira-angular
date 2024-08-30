import {TipoAtivo} from "./TipoAtivo";

export interface Setor {
  id?: number;
  descricao?: string;
  dataRegistro?: string;
  tipoAtivo?: TipoAtivo;
  ativos?: number;
}
