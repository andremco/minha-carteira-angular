import {Injectable} from "@angular/core";
import {environment} from "src/environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Dominio} from "src/app/models/Dominio";

@Injectable({
  providedIn: 'root'
})
export class DominioService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  get(urlResource: string) : Observable<ResponseApi<Dominio[]>>{
    return this.http.get<ResponseApi<Dominio[]>>(this.apiUrl + '/dominio/' + urlResource);
  }
}
