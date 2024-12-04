import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Ticker} from "src/app/models/Ticker";
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
