import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exibirTipoAtivo'})
export class TipoAtivoPipe implements PipeTransform {
  transform(ativo: any): string {
    if (ativo){
      if (ativo.acao)
        return "Ação"
      if (ativo.tituloPublico)
        return "Título Público"
    }
    return ""
  }
}
