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
    vuelo: false,
    rentacarro: false,
    traslado: false,
    tours: false,
  };

  isNavegando = false;

  constructor(
    private router: Router,
    private reservaService: ReservaService,
    @Optional() private modalRef?: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    const seleccionados = this.reservaService.getServiciosSeleccionados();
    this.servicios.hotel = seleccionados.includes('hotel');
    this.servicios.vuelo = seleccionados.includes('vuelo');
    this.servicios.rentacarro = seleccionados.includes('rentacarro');
    this.servicios.traslado = seleccionados.includes('traslado');
    this.servicios.tours = seleccionados.includes('tours');
  }

  continuar() {
    if (this.isNavegando) {
      return;
    }
    this.isNavegando = true;

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

    if (servicio === 'vuelo') {
      if (this.reservaService.tieneVueloComplementario()) {
        this.navegarAlSiguienteServicio(servicios, indice + 1);
      } else {
        this.router.navigate(['/busqueda'], {
          queryParams: { returnTo: 'servicios' },
        });
      }
      return;
    }

    this.router.navigate(['/reserva/servicios', servicio]);
  }

  get esReservaHotel(): boolean {
    return this.reservaService.getTipoReserva() === 'hotel';
  }

  get haySeleccion(): boolean {
    return this.esReservaHotel
      ? this.servicios.vuelo ||
          this.servicios.traslado ||
          this.servicios.rentacarro ||
          this.servicios.tours
      : this.servicios.hotel ||
          this.servicios.traslado ||
          this.servicios.rentacarro ||
          this.servicios.tours;
  }
}
