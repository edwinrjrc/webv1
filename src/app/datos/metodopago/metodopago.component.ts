import {
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { DatostarjetaComponent } from '../datostarjeta/datostarjeta.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from '../../_services/reserva.service';

@Component({
  selector: 'app-metodopago',
  standalone: true,
  imports: [CommonModule, DatostarjetaComponent, ReactiveFormsModule],
  templateUrl: './metodopago.component.html',
  styleUrl: './metodopago.component.css',
})
export class MetodopagoComponent implements OnInit {
  tipoMedioPago!: number;
  TIPO_TARJETACREDITO!: number;
  TIPO_TRANSFERENCIA!: number;

  @Output() datosGuardados = new EventEmitter<any>();

  metodoPagoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reservaService: ReservaService,
  ) {
    this.TIPO_TARJETACREDITO = 1;
    this.TIPO_TRANSFERENCIA = 2;
  }

  ngOnInit(): void {
    this.metodoPagoForm =
      this.reservaService.getMetodoPagoForm() ||
      this.fb.group({
        numeroTarjeta: ['', []],
        nombreTitular: ['', []],
        vctoTarjeta: ['', []],
        codigoSeguridadTarjeta: ['', []],
      });

    // 2. Escuchemos qué pasa por aquí
    this.reservaService.datosReserva$.subscribe((datos) => {
      if (datos?.MetodoPago) {
        console.log(
          '👨‍👦 PADRE (MetodoPago): Veo que mi hijo ya guardó la tarjeta:',
          datos.MetodoPago,
        );
      }
    });
  }
}
