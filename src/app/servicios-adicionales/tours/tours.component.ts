import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';
import { Tour } from '../../modelo/tour';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tours.component.html',
  styleUrl: './tours.component.css',
})
export class ToursComponent implements OnInit {
  toursDisponibles: Tour[] = [
    { id: 1, nombre: 'City Tour', descripcion: 'Recorrido por los principales atractivos de la ciudad', duracion: '4 horas', precio: 35 },
    { id: 2, nombre: 'Tour Histórico', descripcion: 'Visita a monumentos y lugares históricos', duracion: '6 horas', precio: 55 },
    { id: 3, nombre: 'Tour Gastronómico', descripcion: 'Degustación de la gastronomía local', duracion: '3 horas', precio: 45 },
    { id: 4, nombre: 'Tour de Aventura', descripcion: 'Actividades al aire libre y naturaleza', duracion: '8 horas', precio: 80 },
    { id: 5, nombre: 'Tour Nocturno', descripcion: 'La ciudad de noche con guía especializado', duracion: '3 horas', precio: 40 },
  ];

  fechasTours: Record<number, string> = {};

  constructor(
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    const toursGuardados = this.reservaService.getTours();
    if (toursGuardados.length > 0) {
      toursGuardados.forEach((tGuardado) => {
        const tour = this.toursDisponibles.find((t) => t.id === tGuardado.id);
        if (tour) {
          tour.seleccionado = tGuardado.seleccionado;
          if (tGuardado.fecha) {
            this.fechasTours[tour.id] = tGuardado.fecha;
          }
        }
      });
    }
  }

  get totalTours(): number {
    return this.toursDisponibles
      .filter((t) => t.seleccionado)
      .reduce((sum, t) => sum + t.precio, 0);
  }

  get haySeleccion(): boolean {
    return this.toursDisponibles.some((t) => t.seleccionado);
  }

  guardar() {
    const seleccionados = this.toursDisponibles
      .filter((t) => t.seleccionado)
      .map((t) => ({ ...t, fecha: this.fechasTours[t.id] || '' }));

    this.reservaService.setTours(seleccionados);
    this.navegarAlSiguiente();
  }

  navegarAlSiguiente() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('tours');
    const siguiente = servicios[idx + 1];
    if (siguiente) {
      this.router.navigate(['/reserva/servicios', siguiente]);
    } else {
      this.router.navigate(['/reserva/resumen-servicios']);
    }
  }

  volver() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('tours');
    const anterior = servicios[idx - 1];
    if (anterior) {
      this.router.navigate(['/reserva/servicios', anterior]);
    } else {
      this.router.navigate(['/reserva/servicios']);
    }
  }
}
