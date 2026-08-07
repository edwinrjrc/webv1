import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { InterDataRptaDestino } from '../modelo/InterDataRptaDestino';

export interface BusquedaHotelRequest {
  destino: string;
  fechaLlegada: string;
  noches: number;
  adultos: number;
  ninos: number;
  infantes: number;
  categoria: string;
  precioMaximo: number;
}

export interface HotelDisponibleResponse {
  id: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  capacidad: number;
  precioPorNoche: number;
  rating: number;
  descripcion: string;
}

export interface ApiResponse<T> {
  error: boolean;
  mensaje: string;
  data: T;
}

export interface ReservaHotelRequest {
  hotelId: string;
  tipoHabitacion: string;
  fechaCheckIn: string;
  fechaCheckOut: string;
  noches: number;
  adultos: number;
  ninos: number;
  infantes: number;
  titularReserva: string;
}

export interface ReservaHotelResponse {
  codigoReserva: string;
  estado: string;
  hotelId: string;
  hotelNombre: string;
  precioTotal: number;
  mensaje: string;
}

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

  buscarHoteles(request: BusquedaHotelRequest) {
    return this.http.post<ApiResponse<HotelDisponibleResponse[]>>(
      `${environment.apiUrl}/api/viajes/hotelservice/busqueda`,
      request,
    );
  }

  reservarHotel(request: ReservaHotelRequest) {
    return this.http.post<ApiResponse<ReservaHotelResponse>>(
      `${environment.apiUrl}/api/viajes/hotelservice/reserva`,
      request,
    );
  }
}