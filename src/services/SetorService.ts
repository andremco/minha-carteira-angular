import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {SalvarSetor} from "../models/setor/SalvarSetor";
import {Setor} from "../models/setor/Setor";
import {Observable} from "rxjs";
import {EditarSetor} from "../models/setor/EditarSetor";
import {Paginado} from "../models/Paginado";
import {ResponseApi} from "../models/ResponseApi";

@Injectable({
  providedIn: 'root'
})
export class SetorService{
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log(this.apiUrl)
  }

  salvar(request : SalvarSetor) : Observable<ResponseApi<Setor>>{
    return this.http.post<ResponseApi<Setor>>(this.apiUrl + '/setor', request);
  }

  editar(request : EditarSetor) : Observable<ResponseApi<Setor>>{
    return this.http.put<ResponseApi<Setor>>(this.apiUrl + '/setor', request);
  }

  filtrar(pagina:Number, tamanho:Number) : Observable<ResponseApi<Paginado<Setor>>>{
    return this.http.get<ResponseApi<Paginado<Setor>>>(this.apiUrl + '/setor/filtrar',
      {headers: {'pagina':pagina.toString(),'tamanho':tamanho.toString()}}
    );
  }
}
