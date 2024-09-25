import {TipoAtivo} from "./TipoAtivo";

export interface Aporte{
  id?: number;
  tipoAtivo?: TipoAtivo;
  ativoId?: number
  ativoDescricao? : string
  preco: number | null;
  quantidade: number | null;
  dataRegistro?: Date;
}
