import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "src/app/models/ResponseApi";
import {SalvarMoeda} from "src/app/models/moeda/SalvarMoeda";
import {Moeda} from "src/app/models/moeda/Moeda";
import {Paginado} from "src/app/models/Paginado";
import {EditarMoeda} from "src/app/models/moeda/EditarMoeda";
import {TipoAtivoEnum} from "../models/enums/TipoAtivoEnum";

@Injectable({
  providedIn: 'root'
})
export class MoedaService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  salvar(request : SalvarMoeda) : Observable<ResponseApi<Moeda>>{
    return this.http.post<ResponseApi<Moeda>>(this.apiUrl + '/moeda', request);
  }
  editar(request : EditarMoeda) : Observable<ResponseApi<Moeda>>{
    return this.http.put<ResponseApi<Moeda>>(this.apiUrl + '/moeda', request);
  }
  obter(idMoeda : number) : Observable<ResponseApi<Moeda>>{
    return this.http.get<ResponseApi<Moeda>>(this.apiUrl + '/moeda/' + idMoeda);
  }
  filtrar(pagina:Number, tamanho:Number, descricaoMoeda?: String) : Observable<ResponseApi<Paginado<Moeda>>>{
    const headers = {
      pagina: pagina.toString(),
      tamanho: tamanho.toString(),
      ...(descricaoMoeda !== undefined && { descricaoMoeda: descricaoMoeda.toString() })
    };
    return this.http.get<ResponseApi<Paginado<Moeda>>>(this.apiUrl + '/moeda/filtrar', { headers })
  }
  deletar(id:Number) : Observable<ResponseApi<Moeda>>{
    return this.http.delete<ResponseApi<Moeda>>(this.apiUrl + '/moeda/' + id);
  }
}
