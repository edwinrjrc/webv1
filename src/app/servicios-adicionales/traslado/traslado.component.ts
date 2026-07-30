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
  selector: 'app-traslado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './traslado.component.html',
  styleUrl: './traslado.component.css',
})
export class TrasladoComponent implements OnInit {
  trasladoForm!: FormGroup;
  tiposTraslado = ['Privado', 'Compartido', 'VIP'];
  preciosPorTipo: Record<string, number> = {
    Privado: 60,
    Compartido: 25,
    VIP: 120,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservaService: ReservaService,
  ) {}

  ngOnInit(): void {
    const trasladoExistente = this.reservaService.getTraslado();

    this.trasladoForm = this.fb.group({
      origen: [trasladoExistente?.origen || '', Validators.required],
      destino: [trasladoExistente?.destino || '', Validators.required],
      fecha: [trasladoExistente?.fecha || '', Validators.required],
      hora: [trasladoExistente?.hora || '', Validators.required],
      tipoTraslado: [trasladoExistente?.tipoTraslado || '', Validators.required],
    });
  }

  get precioEstimado(): number {
    const tipo = this.trasladoForm.get('tipoTraslado')?.value;
    return this.preciosPorTipo[tipo] || 0;
  }

  guardar() {
    if (this.trasladoForm.invalid) {
      this.trasladoForm.markAllAsTouched();
      return;
    }

    const val = this.trasladoForm.value;
    this.reservaService.setTraslado({
      ...val,
      precio: this.precioEstimado,
    });

    this.navegarAlSiguiente();
  }

  navegarAlSiguiente() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('traslado');
    const siguiente = servicios[idx + 1];
    if (siguiente) {
      this.router.navigate(['/reserva/servicios', siguiente]);
    } else {
      this.router.navigate(['/reserva/resumen-servicios']);
    }
  }

  volver() {
    const servicios = this.reservaService.getServiciosSeleccionados();
    const idx = servicios.indexOf('traslado');
    const anterior = servicios[idx - 1];
    if (anterior) {
      this.router.navigate(['/reserva/servicios', anterior]);
    } else {
      this.router.navigate(['/reserva/servicios']);
    }
  }
}
