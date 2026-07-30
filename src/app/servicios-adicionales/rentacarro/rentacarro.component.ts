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
  selector: 'app-rentacarro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rentacarro.component.html',
  styleUrl: './rentacarro.component.css',
})
export class RentacarroComponent implements OnInit {
  rentaCarroForm!: FormGroup;
  tiposVehiculo = ['Económico', 'Compacto', 'Sedán', 'SUV', 'Camioneta'];
  preciosPorTipo: Record<string, number> = {
    Económico: 40,
    Compacto: 55,
    Sedán: 70,
    SUV: 95,
    Camioneta: 110,
  };
  ubicaciones = ['Aeropuerto', 'Centro de la ciudad', 'Hotel'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    const rentaExistente = this.reservaService.getRentaCarro();

    this.rentaCarroForm = this.fb.group({
      fechaRetiro: [rentaExistente?.fechaRetiro || '', Validators.required],
      fechaDevolucion: [rentaExistente?.fechaDevolucion || '', Validators.required],
      tipoVehiculo: [rentaExistente?.tipoVehiculo || '', Validators.required],
      ubicacionRetiro: [rentaExistente?.ubicacionRetiro || '', Validators.required],
    });
  }

  get precioEstimado(): number {
    const tipo = this.rentaCarroForm.get('tipoVehiculo')?.value;
    const retiro = this.rentaCarroForm.get('fechaRetiro')?.value;
    const devolucion = this.rentaCarroForm.get('fechaDevolucion')?.value;
    if (!tipo || !retiro || !devolucion) return 0;
    const dias = Math.max(1, Math.ceil(
      (new Date(devolucion).getTime() - new Date(retiro).getTime()) / (1000 * 60 * 60 * 24)
    ));
    return (this.preciosPorTipo[tipo] || 0) * dias;
  }

  guardar() {
    if (this.rentaCarroForm.invalid) {
      this.rentaCarroForm.markAllAsTouched();
      return;
    }

    const val = this.rentaCarroForm.value;
    this.reservaService.setRentaCarro({
      ...val,
      precio: this.precioEstimado,
    });

    this.navegarAlSiguiente();
  }

  navegarAlSiguiente() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('rentacarro');
    const siguiente = servicios[idx + 1];
    if (siguiente) {
      this.router.navigate(['/reserva/servicios', siguiente]);
    } else {
      this.router.navigate(['/reserva/resumen-servicios']);
    }
  }

  volver() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('rentacarro');
    const anterior = servicios[idx - 1];
    if (anterior) {
      this.router.navigate(['/reserva/servicios', anterior]);
    } else {
      this.router.navigate(['/reserva/servicios']);
    }
  }
}
