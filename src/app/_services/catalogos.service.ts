import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InterDataRptaDestino } from '../modelo/InterDataRptaDestino';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(protected http: HttpClient) { }

  listarDestinos(nombreDestino: string) {
    // 1. No definas headers manualmente aquí a menos que sean estrictamente necesarios.
    // El Interceptor se encargará de añadir el 'Authorization'.
    
    // 2. HttpParams debe asignarse al setearse porque es inmutable.
    const params = new HttpParams().set('nombreDestino', nombreDestino);

    // 3. Llama al servicio sin pasar headers manuales para evitar conflictos.
    return this.http.get<InterDataRptaDestino>(
      `${environment.apiUrl}/api/viajes/destinoservice/destinoCiudadService`, 
      { params } 
    );
  }
}