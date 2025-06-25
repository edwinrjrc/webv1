import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { OfertasEncontradas } from '../modelo/ofertasEncontradas';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada';

@Component({
  selector: 'app-ofertavuelo',
  standalone: true,
  imports: [DecimalPipe, DatePipe],
  templateUrl: './ofertavuelo.component.html',
  styleUrl: './ofertavuelo.component.css'
})
export class OfertavueloComponent {
  @Input() ofertaEncontrada!: OfertasEncontradas;
  precioAdulto: Number = 10098.21;

  @Output() messageEvent = new EventEmitter<string>();

  flgDatosUsuario !: string;

  constructor(){
    this.precioAdulto = 10098.21;
  }

  comprarOferta(idOferta: number){

    let ofertaSeleccionada: OfertaSeleccionada;

    ofertaSeleccionada = new OfertaSeleccionada();
    ofertaSeleccionada.IdOferta = idOferta;
    ofertaSeleccionada.FlgProceso = 'R';

    const ofertaSeleccionadaJson: string = JSON.stringify(ofertaSeleccionada);

    this.messageEvent.emit(ofertaSeleccionadaJson);
  }

}
