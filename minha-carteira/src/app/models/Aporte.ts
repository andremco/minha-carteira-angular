import {TipoAtivo} from "./TipoAtivo";

export interface Aporte{
  id?: number;
  tipoAtivo?: TipoAtivo;
  ativoId?: number
  ativoDescricao? : string
  preco?: number;
  quantidade?: number;
  dataRegistro?: Date;
}
