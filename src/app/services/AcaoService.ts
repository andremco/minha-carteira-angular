import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "src/app/models/ResponseApi";
import {SalvarAcao} from "src/app/models/acao/SalvarAcao";
import {Acao} from "src/app/models/acao/Acao";
import {Paginado} from "src/app/models/Paginado";
import {EditarAcao} from "src/app/models/acao/EditarAcao";
import {TipoAtivoEnum} from "../models/enums/TipoAtivoEnum";

@Injectable({
  providedIn: 'root'
})
export class AcaoService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  salvar(request : SalvarAcao) : Observable<ResponseApi<Acao>>{
    return this.http.post<ResponseApi<Acao>>(this.apiUrl + '/acao', request);
  }
  editar(request : EditarAcao) : Observable<ResponseApi<Acao>>{
    return this.http.put<ResponseApi<Acao>>(this.apiUrl + '/acao', request);
  }
  obter(idAcao : number) : Observable<ResponseApi<Acao>>{
    return this.http.get<ResponseApi<Acao>>(this.apiUrl + '/acao/' + idAcao);
  }
  filtrar(pagina:Number, tamanho:Number, tipoAtivoId?: TipoAtivoEnum, descricaoAtivo?: String) : Observable<ResponseApi<Paginado<Acao>>>{
    const headers = {
      pagina: pagina.toString(),
      tamanho: tamanho.toString(),
      ...(descricaoAtivo !== undefined && { descricaoAtivo: descricaoAtivo.toString() }),
      ...(tipoAtivoId !== undefined && { tipoAtivoId: tipoAtivoId.toString() }),
    };
    return this.http.get<ResponseApi<Paginado<Acao>>>(this.apiUrl + '/acao/filtrar', { headers })
  }
  deletar(id:Number) : Observable<ResponseApi<Acao>>{
    return this.http.delete<ResponseApi<Acao>>(this.apiUrl + '/acao/' + id);
  }
}
