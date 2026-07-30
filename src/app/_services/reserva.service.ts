import { Injectable } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
import { DatosCompraTotal } from '../modelo/datoscompratotal';

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

  // Método para resetear cuando termine la compra
  limpiarReserva() {
    this.ofertaSource.next(null);
    this.consultaSource.next(null);
    this.serviciosAdicionalesSource.next(null);
  }

  setServiciosAdicionales(servicios: ServiciosAdicionales) {
    this.serviciosAdicionalesSource.next(servicios);
  }

  getServiciosAdicionales(): ServiciosAdicionales | null {
    return this.serviciosAdicionalesSource.getValue();
  }

  actualizarDatosCompra(datos: DatosCompraTotal) {
    this.datosReservaSource.next(datos);
  }

  getDatosReservaActual() {
    return this.datosReservaSource.getValue();
  }
}
