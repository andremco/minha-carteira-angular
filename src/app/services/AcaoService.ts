import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "src/models/ResponseApi";
import {SalvarAcao} from "src/models/acao/SalvarAcao";
import {Acao} from "src/models/acao/Acao";
import {Paginado} from "src/models/Paginado";
import {EditarAcao} from "src/models/acao/EditarAcao";

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
  filtrar(pagina:Number, tamanho:Number) : Observable<ResponseApi<Paginado<Acao>>>{
    return this.http.get<ResponseApi<Paginado<Acao>>>(this.apiUrl + '/acao/filtrar',
      {headers: {'pagina':pagina.toString(),'tamanho':tamanho.toString()}}
    );
  }
  deletar(id:Number) : Observable<ResponseApi<Acao>>{
    return this.http.delete<ResponseApi<Acao>>(this.apiUrl + '/acao/' + id);
  }
}
