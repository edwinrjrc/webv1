import { Component, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservaService } from '../_services/reserva.service';

@Component({
  selector: 'app-servicios-adicionales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios-adicionales.component.html',
  styleUrl: './servicios-adicionales.component.css',
})
export class ServiciosAdicionalesComponent implements OnInit {
  servicios = {
    hotel: false,
    rentacarro: false,
    traslado: false,
    tours: false,
  };

  constructor(
    private router: Router,
    private reservaService: ReservaService,
    @Optional() private modalRef?: NgbActiveModal,
  ) {}

  ngOnInit(): void {}

  continuar() {
    const seleccionados = Object.entries(this.servicios)
      .filter(([, val]) => val)
      .map(([key]) => key);

    this.reservaService.setServiciosSeleccionados(seleccionados);
    this.modalRef?.close();

    if (seleccionados.length === 0) {
      this.irAPago();
      return;
    }

    this.navegarAlSiguienteServicio(seleccionados, 0);
  }

  saltar() {
    this.reservaService.setServiciosSeleccionados([]);
    this.modalRef?.close();
    this.irAPago();
  }

  irAPago() {
    this.router.navigate(['/reserva/pago']);
  }

  navegarAlSiguienteServicio(servicios: string[], indice: number) {
    if (indice >= servicios.length) {
      this.router.navigate(['/reserva/resumen-servicios']);
      return;
    }
    const servicio = servicios[indice];
    this.router.navigate(['/reserva/servicios', servicio]);
  }

  get haySeleccion(): boolean {
    return Object.values(this.servicios).some((v) => v);
  }
}
