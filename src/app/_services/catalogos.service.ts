import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InterDataRptaDestino } from '../modelo/InterDataRptaDestino';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(protected http: HttpClient) { }

  listarDestinos(nombreDestino: string){

      let cabece = new HttpHeaders();
      cabece.set('Content-Type', 'application/json; charset=utf-8');

      let params = new HttpParams();
      params.set('nombreDestino', nombreDestino);

      const servicio = this.http.get<InterDataRptaDestino>(`${environment.apiUrl}/iv-service-viajes/destinoservice/destinoCiudadService`, {headers : cabece, observe: 'body', params:params } );

      return servicio;
  }
}
