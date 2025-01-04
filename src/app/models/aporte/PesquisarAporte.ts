import {TipoAtivoEnum} from "../enums/TipoAtivoEnum";

export interface PesquisarAporte{
  tipoAtivoId?: TipoAtivoEnum,
  ativoId?: number,
  dataInicio?: string,
  dataFim?: string
}
