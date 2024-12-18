import {Aporte} from "./Aporte";

export interface EditarAporte extends Aporte{
  acaoId?: number
  tituloPublicoId?: number
}
