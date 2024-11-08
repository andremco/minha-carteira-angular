import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../models/ResponseApi";
import {Dominio} from "../models/Dominio";
import {Ticker} from "../models/Ticker";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TickerService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  obter(ticker: string) : Observable<ResponseApi<Ticker>>{
    return this.http.get<ResponseApi<Ticker>>(this.apiUrl + '/ticker/' + ticker);
  }
}
