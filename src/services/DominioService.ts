import {Injectable} from "@angular/core";
import {environment} from "../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ResponseApi} from "../models/ResponseApi";
import {Dominio} from "../models/Dominio";

@Injectable({
  providedIn: 'root'
})
export class DominioService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    console.log(this.apiUrl)
  }
  get(urlResource: string) : Observable<ResponseApi<Dominio[]>>{
    return this.http.get<ResponseApi<Dominio[]>>(this.apiUrl + '/dominio/' + urlResource);
  }
}
