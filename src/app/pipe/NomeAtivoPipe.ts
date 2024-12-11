import {Pipe, PipeTransform} from "@angular/core";
@Pipe({ name: 'exibirNomeAtivo'})
export class NomeAtivoPipe implements PipeTransform {
  transform(ativo : any): string {
    if (ativo){
      if (ativo.acao)
        return ativo.acao.razaoSocial
      if (ativo.tituloPublico)
        return ativo.tituloPublico.descricao
    }
    return ""
  }
}
