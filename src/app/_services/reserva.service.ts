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
  private serviciosAdicionalesSource =
    new BehaviorSubject<ServiciosAdicionales | null>(null);

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

  /**
   * Helper para obtener la lista de ítems de traslado consumida por TrasladoComponent
   */
  getTraslados(): any[] {
    const trasladoActual: any = this.trasladoSource.getValue();
    if (!trasladoActual) return [];
    if (Array.isArray(trasladoActual)) return trasladoActual;
    return trasladoActual.items || [trasladoActual];
  }

  /**
   * Helper para actualizar los ítems de traslado desde TrasladoComponent
   */
  setTraslados(traslados: any[]): void {
    const totalPrecio = traslados.reduce((acc, t) => acc + (t.precio || 0), 0);
    const payload: any = {
      items: traslados,
      precio: totalPrecio,
    };
    this.trasladoSource.next(payload);
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
    tours.filter((t) => t.seleccionado).forEach((t) => (total += t.precio));

    return total;
  }

  getResumenServicios(): ServicioAdicional[] {
    const resumen: ServicioAdicional[] = [];
    const hotel = this.getReservaHotel();
    const carro = this.getRentaCarro();
    const traslado = this.getTraslado();
    const tours = this.getTours().filter((t) => t.seleccionado);

    if (hotel)
      resumen.push({
        tipo: 'hotel',
        nombre: 'Hotel',
        precio: hotel.precio,
        completado: true,
      });
    if (carro)
      resumen.push({
        tipo: 'rentacarro',
        nombre: 'Renta de Carro',
        precio: carro.precio,
        completado: true,
      });
    if (traslado)
      resumen.push({
        tipo: 'traslado',
        nombre: 'Traslado',
        precio: traslado.precio,
        completado: true,
      });
    if (tours.length > 0) {
      const totalTours = tours.reduce((sum, t) => sum + t.precio, 0);
      resumen.push({
        tipo: 'tours',
        nombre: 'Tours',
        precio: totalTours,
        completado: true,
      });
    }

    return resumen;
  }

  /**
   * Genera automáticamente traslados sugeridos/predeterminados basados en la selección de hotel.
   * @param nombreHotel Nombre del hotel seleccionado
   * @param ubicacion Dirección o zona del hotel
   */
  generarTrasladosPorDefecto(nombreHotel: string, ubicacion?: string): void {
    const destino = ubicacion ? `${nombreHotel} - ${ubicacion}` : nombreHotel;

    const trasladosDefecto = [
      {
        id: 'def-ida-' + Date.now(),
        nombre: `Traslado Estándar - Aeropuerto a ${nombreHotel}`,
        empresaId: 'movego',
        empresaNombre: 'MoveGo Transfers',
        destinoDireccion: destino,
        tipoServicio: 'economico',
        precio: 35.0,
        horaRecojoIda: '18:00',
        esVuelta: false,
      },
      {
        id: 'def-vuelta-' + Date.now(),
        nombre: `Traslado Estándar - ${nombreHotel} a Aeropuerto`,
        empresaId: 'movego',
        empresaNombre: 'MoveGo Transfers',
        destinoDireccion: destino,
        tipoServicio: 'economico',
        precio: 35.0,
        fechaRecojoVuelta: '2026-09-20',
        horaRecojoVuelta: '10:00',
        esVuelta: true,
      },
    ];

    // Guarda los traslados generados en el Subject de traslados
    this.setTraslados(trasladosDefecto);
  }
}
