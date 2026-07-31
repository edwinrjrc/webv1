import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { DatosCompraTotal } from '../modelo/datoscompratotal';
import { ServicioAdicional } from '../modelo/servicioAdicional';
import { ReservaHotel } from '../modelo/reservaHotel';
import { RentaCarro } from '../modelo/rentaCarro';
import { Traslado } from '../modelo/traslado';
import { Tour } from '../modelo/tour';

export interface ServiciosAdicionales {
  hotel: boolean;
  traslado: boolean;
  rentaCarro: boolean;
  tours: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReservaService {
  // 1. Definimos los "sujetos" (privados, donde metemos la información)
  private ofertaSource = new BehaviorSubject<any>(null);
  private consultaSource = new BehaviorSubject<any>(null);
  private serviciosAdicionalesSource = new BehaviorSubject<ServiciosAdicionales | null>(null);

  private datosReservaSource = new BehaviorSubject<DatosCompraTotal | null>(
    null,
  );
  datosReserva$ = this.datosReservaSource.asObservable();
  serviciosAdicionales$ = this.serviciosAdicionalesSource.asObservable();

  // Servicios adicionales seleccionados
  private serviciosSeleccionadosSource = new BehaviorSubject<string[]>([]);
  serviciosSeleccionados$ = this.serviciosSeleccionadosSource.asObservable();

  // Datos de cada servicio adicional
  private reservaHotelSource = new BehaviorSubject<ReservaHotel | null>(null);
  reservaHotel$ = this.reservaHotelSource.asObservable();

  private rentaCarroSource = new BehaviorSubject<RentaCarro | null>(null);
  rentaCarro$ = this.rentaCarroSource.asObservable();

  private trasladoSource = new BehaviorSubject<Traslado | null>(null);
  traslado$ = this.trasladoSource.asObservable();

  private toursSource = new BehaviorSubject<Tour[]>([]);
  tours$ = this.toursSource.asObservable();

  private metodoPagoForm: any = null;

  // 2. Definimos los "observables" (públicos, de donde los componentes leen)
  // Agregamos el filter para que no emitan el "null" inicial que rompe la navegación
  ofertaActual$ = this.ofertaSource
    .asObservable()
    .pipe(filter((valor) => valor !== null));

  datosBusqueda$ = this.consultaSource
    .asObservable()
    .pipe(filter((valor) => valor !== null));

  constructor() {}

  // 3. Método único para guardar todo antes de viajar a la ruta /reserva
  setDatosReserva(consulta: any, oferta: any) {
    this.consultaSource.next(consulta);
    this.ofertaSource.next(oferta);
  }

  // Método para obtener la oferta actual
  getOfertaActual(): any {
    return this.ofertaSource.getValue();
  }

  // Método para resetear cuando termine la compra
  limpiarReserva() {
    this.ofertaSource.next(null);
    this.consultaSource.next(null);
    this.serviciosSeleccionadosSource.next([]);
    this.reservaHotelSource.next(null);
    this.rentaCarroSource.next(null);
    this.trasladoSource.next(null);
    this.toursSource.next([]);
  }

  actualizarDatosCompra(datos: DatosCompraTotal) {
    this.datosReservaSource.next(datos);
  }

  setMetodoPagoForm(form: any) {
    this.metodoPagoForm = form;
  }

  getMetodoPagoForm() {
    return this.metodoPagoForm;
  }

  getDatosReservaActual() {
    return this.datosReservaSource.getValue();
  }

  // Servicios adicionales
  setServiciosSeleccionados(servicios: string[]) {
    this.serviciosSeleccionadosSource.next(servicios);
  }

  getServiciosSeleccionados(): string[] {
    return this.serviciosSeleccionadosSource.getValue();
  }

  setReservaHotel(datos: ReservaHotel) {
    this.reservaHotelSource.next(datos);
  }

  getReservaHotel(): ReservaHotel | null {
    return this.reservaHotelSource.getValue();
  }

  setRentaCarro(datos: RentaCarro) {
    this.rentaCarroSource.next(datos);
  }

  getRentaCarro(): RentaCarro | null {
    return this.rentaCarroSource.getValue();
  }

  setTraslado(datos: Traslado) {
    this.trasladoSource.next(datos);
  }

  getTraslado(): Traslado | null {
    return this.trasladoSource.getValue();
  }

  setTours(tours: Tour[]) {
    this.toursSource.next(tours);
  }

  getTours(): Tour[] {
    return this.toursSource.getValue();
  }

  calcularTotalServicios(): number {
    let total = 0;
    const hotel = this.getReservaHotel();
    const carro = this.getRentaCarro();
    const traslado = this.getTraslado();
    const tours = this.getTours();

    if (hotel) total += hotel.precio;
    if (carro) total += carro.precio;
    if (traslado) total += traslado.precio;
    tours.filter(t => t.seleccionado).forEach(t => total += t.precio);

    return total;
  }

  getResumenServicios(): ServicioAdicional[] {
    const resumen: ServicioAdicional[] = [];
    const hotel = this.getReservaHotel();
    const carro = this.getRentaCarro();
    const traslado = this.getTraslado();
    const tours = this.getTours().filter(t => t.seleccionado);

    if (hotel) resumen.push({ tipo: 'hotel', nombre: 'Hotel', precio: hotel.precio, completado: true });
    if (carro) resumen.push({ tipo: 'rentacarro', nombre: 'Renta de Carro', precio: carro.precio, completado: true });
    if (traslado) resumen.push({ tipo: 'traslado', nombre: 'Traslado', precio: traslado.precio, completado: true });
    if (tours.length > 0) {
      const totalTours = tours.reduce((sum, t) => sum + t.precio, 0);
      resumen.push({ tipo: 'tours', nombre: 'Tours', precio: totalTours, completado: true });
    }

    return resumen;
  }
}
