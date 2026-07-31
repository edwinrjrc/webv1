import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';
import { ServicioAdicional } from '../../modelo/servicioAdicional';

@Component({
  selector: 'app-resumen-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-servicios.component.html',
  styleUrl: './resumen-servicios.component.css',
})
export class ResumenServiciosComponent implements OnInit {
  servicios: ServicioAdicional[] = [];
  totalServicios = 0;
  hotel: any = null;
  rentaCarro: any = null;
  traslado: any = null;
  tours: any[] = [];

  constructor(
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    this.servicios = this.reservaService.getResumenServicios();
    this.totalServicios = this.reservaService.calcularTotalServicios();
    this.hotel = this.reservaService.getReservaHotel();
    this.rentaCarro = this.reservaService.getRentaCarro();
    this.traslado = this.reservaService.getTraslado();
    this.tours = this.reservaService.getTours().filter((t) => t.seleccionado);
  }

  editarServicio(tipo: string) {
    this.router.navigate(['/reserva/servicios', tipo]);
  }

  irAPago() {
    this.router.navigate(['/reserva/pago']);
  }

  volverAServicios() {
    this.router.navigate(['/reserva/servicios']);
  }

  get iconoPorTipo(): Record<string, string> {
    return {
      hotel: 'bi-building',
      rentacarro: 'bi-car-front',
      traslado: 'bi-bus-front',
      tours: 'bi-map',
    };
  }
}
