import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ReservaService } from '../../_services/reserva.service';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css',
})
export class HotelComponent implements OnInit {
  hotelForm!: FormGroup;
  tiposHabitacion = ['Simple', 'Doble', 'Suite', 'Familiar'];
  preciosPorTipo: Record<string, number> = {
    Simple: 80,
    Doble: 120,
    Suite: 250,
    Familiar: 180,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    const oferta = this.reservaService.getOfertaActual();

    // Pre-fill dates from flight data if available
    let fechaIn = '';
    let fechaOut = '';

    if (oferta) {
      try {
        const tramos = oferta?.tramosDto || oferta?.tramos || [];
        if (tramos.length > 0) {
          fechaIn = tramos[0]?.fechaSalida?.substring(0, 10) || '';
          const ultimoTramo = tramos[tramos.length - 1];
          fechaOut = ultimoTramo?.fechaLlegada?.substring(0, 10) || '';
        }
      } catch {
        // use empty dates if parsing fails
      }
    }

    const hotelExistente = this.reservaService.getReservaHotel();

    this.hotelForm = this.fb.group({
      fechaCheckIn: [hotelExistente?.fechaCheckIn || fechaIn, Validators.required],
      fechaCheckOut: [hotelExistente?.fechaCheckOut || fechaOut, Validators.required],
      tipoHabitacion: [hotelExistente?.tipoHabitacion || '', Validators.required],
      cantidadHuespedes: [hotelExistente?.cantidadHuespedes || 1, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  get precioEstimado(): number {
    const tipo = this.hotelForm.get('tipoHabitacion')?.value;
    const checkIn = this.hotelForm.get('fechaCheckIn')?.value;
    const checkOut = this.hotelForm.get('fechaCheckOut')?.value;
    if (!tipo || !checkIn || !checkOut) return 0;
    const dias = Math.max(1, Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    ));
    return (this.preciosPorTipo[tipo] || 0) * dias;
  }

  guardar() {
    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      return;
    }

    const val = this.hotelForm.value;
    this.reservaService.setReservaHotel({
      ...val,
      precio: this.precioEstimado,
    });

    this.navegarAlSiguiente();
  }

  navegarAlSiguiente() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('hotel');
    const siguiente = servicios[idx + 1];
    if (siguiente) {
      this.router.navigate(['/reserva/servicios', siguiente]);
    } else {
      this.router.navigate(['/reserva/resumen-servicios']);
    }
  }

  volver() {
    this.router.navigate(['/reserva/servicios']);
  }
}
