import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exibirTipoAtivo'})
export class TipoAtivoPipe implements PipeTransform {
  transform(tipoAtivo: number): string {
    if (tipoAtivo == 1)
      return "Ação"
    if (tipoAtivo == 2)
      return "Título Público"
    if (tipoAtivo == 3)
      return "Fundo Imobiliário"
    return ""
  }
}
