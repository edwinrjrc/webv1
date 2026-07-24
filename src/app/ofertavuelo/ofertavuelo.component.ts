import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada';

@Component({
  selector: 'app-ofertavuelo',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModalModule],
  templateUrl: './ofertavuelo.component.html',
  styleUrls: ['./ofertavuelo.component.css'],
})
export class OfertavueloComponent {
  @Input() ofertaEncontrada: any;
  @ViewChild('modalItinerario') modalItinerario!: TemplateRef<any>;

  @Output() messageEvent = new EventEmitter<string>();

  horarioSeleccionado: any = null;
  rutaPadre: any = null;
  horariosSeleccionados: any = { 1: null, 2: null };
  horarioSeleccionadoGlobal: any = null;

  constructor(private modalService: NgbModal) {}

  abrirModalDetalle(horario: any, ruta: any) {
    this.horarioSeleccionado = horario;
    this.rutaPadre = ruta;
    this.modalService.open(this.modalItinerario, {
      centered: true,
      size: 'lg',
    });
  }

  comprarOferta(idOferta: number) {
    let ofertaSeleccionada: OfertaSeleccionada;

    ofertaSeleccionada                = new OfertaSeleccionada();
    ofertaSeleccionada.IdOferta       = idOferta;
    ofertaSeleccionada.FlgProceso     = 'R';
    ofertaSeleccionada.IdOfertaIda    = this.horariosSeleccionados[1];
    ofertaSeleccionada.IdOfertaVuelta = this.horariosSeleccionados[2];
    ofertaSeleccionada.OfertaVuelo    = this.ofertaEncontrada;

    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }

    const ofertaSeleccionadaJson: string = JSON.stringify(ofertaSeleccionada);
    this.messageEvent.emit(ofertaSeleccionadaJson);
  }

  isValidDate(dateString: any): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    // Si el año es menor a 1900 o no es un número, es una fecha inválida
    return !isNaN(date.getTime()) && date.getFullYear() > 1900;
  }

  elegirVuelo() {
    // Aquí le enviamos el vuelo seleccionado al componente padre
    this.messageEvent.emit(this.ofertaEncontrada);
  }
}
