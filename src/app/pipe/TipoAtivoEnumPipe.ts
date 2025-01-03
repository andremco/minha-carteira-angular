import {Pipe, PipeTransform} from "@angular/core";
import {TipoAtivoEnum} from "../models/enums/TipoAtivoEnum";

@Pipe({standalone: true, name: 'exibirTipoAtivoEnum'})
export class TipoAtivoEnumPipe implements PipeTransform {
  transform(tipo: TipoAtivoEnum): string {
    if (tipo == TipoAtivoEnum.Acao)
      return "Ação"
    if (tipo == TipoAtivoEnum.FundoImobiliario)
      return "Fundo Imobiliário"
    if (tipo == TipoAtivoEnum.BrazilianDepositaryReceipts)
      return "Brazilian Depositary Receipts"
    if (tipo == TipoAtivoEnum.TituloPublico)
      return "Título Público"
    return ""
  }
}
