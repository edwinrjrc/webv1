import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BusquedaRentaCarroRequest {
  lugarRecogida: string;
  lugarDevolucion: string;
  fechaRecogida: string;
  fechaDevolucion: string;
  tipoVehiculo: string;
  adultos: number;
}

export interface BusquedaPaqueteRequest {
  origen: string;
  destino: string;
  fechaSalida: string;
  fechaRegreso: string;
  adultos: number;
  ninos: number;
  infantes: number;
}

export interface BusquedaTourRequest {
  destino: string;
  fechaTour: string;
  adultos: number;
  ninos: number;
}

export interface BusquedaSeguroViajeRequest {
  destino: string;
  fechaSalida: string;
  fechaRegreso: string;
  adultos: number;
  ninos: number;
}

export interface BusquedaSeguroRequest {
  tipoSeguro: string;
  fechaInicio: string;
  adultos: number;
}

@Injectable({
  providedIn: 'root',
})
export class ServiciosBusquedaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  buscarRentaCarro(request: BusquedaRentaCarroRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/servicios/rentacarro/buscar`,
      request,
    );
  }

  buscarPaquetes(request: BusquedaPaqueteRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/servicios/paquetes/buscar`,
      request,
    );
  }

  buscarTours(request: BusquedaTourRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/servicios/tours/buscar`,
      request,
    );
  }

  buscarSeguroViaje(request: BusquedaSeguroViajeRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/servicios/seguro-viaje/buscar`,
      request,
    );
  }

  buscarSeguros(request: BusquedaSeguroRequest): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/api/servicios/seguros/buscar`,
      request,
    );
  }
}
