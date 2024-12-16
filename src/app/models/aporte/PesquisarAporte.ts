import {TipoAtivoEnum} from "../enums/TipoAtivoEnum";

export interface PesquisarAporte{
  tipoAtivo?: TipoAtivoEnum,
  ativoId?: number,
  dataInicio?: string,
  dataFim?: string
}
