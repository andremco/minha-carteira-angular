import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AporteService{
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
}
