import {Pipe, PipeTransform} from "@angular/core";
import {MovimentacaoEnum} from "src/app/models/enums/MovimentacaoEnum";

@Pipe({standalone: true, name: 'exibirMovimentacaoEnum'})
export class MovimentacaoEnumPipe implements PipeTransform{
  transform(movimentacao: MovimentacaoEnum): string {
    if (movimentacao == MovimentacaoEnum.Compra)
      return "Compra"
    if (movimentacao == MovimentacaoEnum.Venda)
      return "Venda"
    return ""
  }
}
