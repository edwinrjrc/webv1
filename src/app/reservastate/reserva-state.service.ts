import { Injectable } from '@angular/core';
import { VueloItinerario } from '../modelo/vueloItinerario';
import { TrasladoItem } from '../modelo/trasladoItem';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ReservaStateService {

  private vueloSubject = new BehaviorSubject<VueloItinerario | null>(null);
  vuelo$ = this.vueloSubject.asObservable();

  private trasladosSubject = new BehaviorSubject<TrasladoItem[]>([]);
  traslados$ = this.trasladosSubject.asObservable();

  constructor() { }

  setVuelo(vuelo: VueloItinerario) {
    this.vueloSubject.next(vuelo);
  }

  getVueloActual(): VueloItinerario | null {
    return this.vueloSubject.getValue();
  }

  setTraslados(traslados: TrasladoItem[]) {
    this.trasladosSubject.next(traslados);
  }
}
