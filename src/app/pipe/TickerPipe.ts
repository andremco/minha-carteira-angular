import {Pipe, PipeTransform} from "@angular/core";
@Pipe({ name: 'exibirTicker'})
export class TickerPipe implements PipeTransform {
  transform(ativo: any): string {
    if (ativo){
      if (ativo.acao)
        return ativo.acao.ticker
      if (ativo.tituloPublico)
        return "-"
    }
    return ""
  }
}
