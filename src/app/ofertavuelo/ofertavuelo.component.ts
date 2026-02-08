import { Component, EventEmitter, inject, Input, Output, signal, TemplateRef, WritableSignal } from '@angular/core';
import { DecimalPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { OfertasEncontradas } from '../modelo/ofertasEncontradas';
import { OfertaSeleccionada } from '../modelo/ofertaSeleccionada';
import { FormsModule } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ofertavuelo',
  standalone: true,
  imports: [DecimalPipe, DatePipe, FormsModule, UpperCasePipe],
  templateUrl: './ofertavuelo.component.html',
  styleUrl: './ofertavuelo.component.css',
})
export class OfertavueloComponent {
  @Input() ofertaEncontrada!: OfertasEncontradas;
  precioAdulto: Number = 10098.21;

  @Output() messageEvent = new EventEmitter<string>();

  private modalService = inject(NgbModal);
	closeResult: WritableSignal<string> = signal('');

  horariosSeleccionados: { [key: number]: number } = {};

  flgDatosUsuario!: string;

  constructor() {
    this.precioAdulto = 10098.21;
  }

  comprarOferta(idOferta: number) {
    let ofertaSeleccionada: OfertaSeleccionada;

    ofertaSeleccionada = new OfertaSeleccionada();
    ofertaSeleccionada.IdOferta = idOferta;
    ofertaSeleccionada.FlgProceso = 'R';
    ofertaSeleccionada.IdOfertaIda = this.horariosSeleccionados[1];
    ofertaSeleccionada.IdOfertaVuelta = this.horariosSeleccionados[2];
    ofertaSeleccionada.OfertaVuelo = this.ofertaEncontrada;

    const ofertaSeleccionadaJson: string = JSON.stringify(ofertaSeleccionada);
    this.messageEvent.emit(ofertaSeleccionadaJson);
  }

  open(content: TemplateRef<any>) {
		this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult.set(`Closed with: ${result}`);
			},
			(reason) => {
				this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
			},
		);
	}

  private getDismissReason(reason: any): string {
		switch (reason) {
			case ModalDismissReasons.ESC:
				return 'by pressing ESC';
			case ModalDismissReasons.BACKDROP_CLICK:
				return 'by clicking on a backdrop';
			default:
				return `with: ${reason}`;
		}
	}

  onItemChange(value: Number) {
    console.log('ID del horario seleccionado:', value);
    console.log('Estado actual de selecciones:', this.horariosSeleccionados);
  }
}
