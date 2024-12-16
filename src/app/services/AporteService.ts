import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {SalvarAcao} from "../models/acao/SalvarAcao";
import {Observable} from "rxjs";
import {ResponseApi} from "../models/ResponseApi";
import {Acao} from "../models/acao/Acao";
import {SalvarAporte} from "../models/aporte/SalvarAporte";
import {Aporte} from "../models/aporte/Aporte";
import {EditarAporte} from "../models/aporte/EditarAporte";
import {Paginado} from "../models/Paginado";

@Injectable({
  providedIn: 'root'
})
export class AporteService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  salvar(request : SalvarAporte) : Observable<ResponseApi<Aporte>>{
    return this.http.post<ResponseApi<Aporte>>(this.apiUrl + '/aporte', request);
  }
  editar(request : EditarAporte) : Observable<ResponseApi<Aporte>>{
    return this.http.put<ResponseApi<Aporte>>(this.apiUrl + '/aporte', request);
  }
  filtrar(pagina:Number, tamanho:Number, tipoAtivo?: Number, ativoId?: Number, dataInicio?: string, dataFim?: string) : Observable<ResponseApi<Paginado<Aporte>>>{
    const headers = {
      pagina: pagina.toString(),
      tamanho: tamanho.toString(),
      ...(tipoAtivo !== undefined && { tipoAtivo: tipoAtivo.toString() }),
      ...(ativoId !== undefined && { ativoId: ativoId.toString() }),
      ...(dataInicio !== undefined && { dataInicio: dataInicio.toString() }),
      ...(dataFim !== undefined && { dataFim: dataFim.toString() }),
    };
    return this.http.get<ResponseApi<Paginado<Aporte>>>(this.apiUrl + '/aporte/filtrar', { headers })
  }
}
