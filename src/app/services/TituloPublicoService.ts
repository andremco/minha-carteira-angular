import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Paginado} from "src/app/models/Paginado";
import {SalvarTituloPublico} from "src/app/models/titulo-publico/SalvarTituloPublico";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {EditarTituloPublico} from "src/app/models/titulo-publico/EditarTituloPublico";

@Injectable({
  providedIn: 'root'
})
export class TituloPublicoService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  salvar(request : SalvarTituloPublico) : Observable<ResponseApi<TituloPublico>>{
    return this.http.post<ResponseApi<TituloPublico>>(this.apiUrl + '/tituloPublico', request);
  }
  editar(request : EditarTituloPublico) : Observable<ResponseApi<TituloPublico>>{
    return this.http.put<ResponseApi<TituloPublico>>(this.apiUrl + '/tituloPublico', request);
  }
  obter(idTituloPublico : number) : Observable<ResponseApi<TituloPublico>>{
    return this.http.get<ResponseApi<TituloPublico>>(this.apiUrl + '/tituloPublico/' + idTituloPublico);
  }
  filtrar(pagina:Number, tamanho:Number) : Observable<ResponseApi<Paginado<TituloPublico>>>{
    return this.http.get<ResponseApi<Paginado<TituloPublico>>>(this.apiUrl + '/tituloPublico/filtrar',
      {headers: {'pagina':pagina.toString(),'tamanho':tamanho.toString()}}
    );
  }
  deletar(id:Number) : Observable<ResponseApi<TituloPublico>>{
    return this.http.delete<ResponseApi<TituloPublico>>(this.apiUrl + '/tituloPublico/' + id);
  }
}
