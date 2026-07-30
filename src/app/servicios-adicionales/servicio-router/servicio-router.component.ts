import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';
import { HotelComponent } from '../hotel/hotel.component';
import { RentacarroComponent } from '../rentacarro/rentacarro.component';
import { TrasladoComponent } from '../traslado/traslado.component';
import { ToursComponent } from '../tours/tours.component';

@Component({
  selector: 'app-servicio-router',
  standalone: true,
  imports: [CommonModule, HotelComponent, RentacarroComponent, TrasladoComponent, ToursComponent],
  template: `
    @if (servicioActual === 'hotel') {
      <app-hotel></app-hotel>
    } @else if (servicioActual === 'rentacarro') {
      <app-rentacarro></app-rentacarro>
    } @else if (servicioActual === 'traslado') {
      <app-traslado></app-traslado>
    } @else if (servicioActual === 'tours') {
      <app-tours></app-tours>
    }
  `,
})
export class ServicioRouterComponent implements OnInit {
  servicioActual = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.servicioActual = params.get('servicio') || '';
    });
  }
}
