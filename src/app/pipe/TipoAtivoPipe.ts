import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exibirTipoAtivo'})
export class TipoAtivoPipe implements PipeTransform {
  transform(ativo: any): string {
    console.log("ativo", ativo)
    if (ativo){
      if (ativo.acao?.setor?.tipoAtivo)
        return ativo.acao?.setor?.tipoAtivo?.descricao;
      if (ativo.tituloPublico?.setor?.tipoAtivo)
        return ativo.tituloPublico?.setor?.tipoAtivo?.descricao;
      if (ativo.moeda)
        return "Moeda";
    }
    return ""
  }
}
