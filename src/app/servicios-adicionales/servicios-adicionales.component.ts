import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservaService } from '../_services/reserva.service';

@Component({
  selector: 'app-servicios-adicionales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-adicionales.component.html',
  styleUrl: './servicios-adicionales.component.css',
})
export class ServiciosAdicionalesComponent {
  hotel: boolean = false;
  traslado: boolean = false;
  rentaCarro: boolean = false;
  tours: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private reservaService: ReservaService,
  ) {}

  confirmar() {
    const servicios = {
      hotel: this.hotel,
      traslado: this.traslado,
      rentaCarro: this.rentaCarro,
      tours: this.tours,
    };
    this.reservaService.setServiciosAdicionales(servicios);
    this.activeModal.close(servicios);
  }

  omitir() {
    this.reservaService.setServiciosAdicionales({
      hotel: false,
      traslado: false,
      rentaCarro: false,
      tours: false,
    });
    this.activeModal.close(null);
  }
}
