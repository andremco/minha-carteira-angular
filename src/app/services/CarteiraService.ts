import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../models/ResponseApi";
import {Dominio} from "../models/Dominio";
import {ValoresCarteiraTotal} from "../models/carteira/ValoresCarteiraTotal";
import {AportesTotal} from "../models/carteira/AportesTotal";
import {AportesValorMensal} from "../models/carteira/AportesValorMensal";
import {SetoresFatiado} from "../models/carteira/SetoresFatiado";

@Injectable({
  providedIn: 'root'
})
export class CarteiraService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  obterCarteiraTotal() : Observable<ResponseApi<ValoresCarteiraTotal>>{
    return this.http.get<ResponseApi<ValoresCarteiraTotal>>(this.apiUrl + '/dashboard/carteira/total');
  }

  obterAportesPorcentagemTotal() : Observable<ResponseApi<AportesTotal>>{
    return this.http.get<ResponseApi<AportesTotal>>(this.apiUrl + '/dashboard/aportes/porcentagem/total');
  }

  obterAportesValorTotal() : Observable<ResponseApi<AportesTotal>>{
    return this.http.get<ResponseApi<AportesTotal>>(this.apiUrl + '/dashboard/aportes/valor/total');
  }

  obterAportesValorMensal(dataInicio : string, dataFim : string) : Observable<ResponseApi<AportesValorMensal>>{
    const headers = {
      ...(dataInicio !== undefined && { dataInicio: dataInicio.toString() }),
      ...(dataFim !== undefined && { dataFim: dataFim.toString() }),
    };
    return this.http.get<ResponseApi<AportesValorMensal>>(this.apiUrl + '/dashboard/aportes/valor/mensal', { headers });
  }

  obterSetoresFatiado(tipoAtivoId : number) : Observable<ResponseApi<SetoresFatiado[]>>{
    return this.http.get<ResponseApi<SetoresFatiado[]>>(this.apiUrl + '/dashboard/setores/fatiado/' + tipoAtivoId);
  }

  obterSetoresAumentoFatiado(tipoAtivoId : number) : Observable<ResponseApi<SetoresFatiado[]>>{
    return this.http.get<ResponseApi<SetoresFatiado[]>>(this.apiUrl + '/dashboard/setores/aumento/fatiado/' + tipoAtivoId);
  }
}
