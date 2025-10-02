import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DatostarjetaComponent } from '../datostarjeta/datostarjeta.component';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { DatostransferenciaComponent } from '../datostransferencia/datostransferencia.component';

@Component({
  selector: 'app-metodopago',
  standalone: true,
  imports: [DatostarjetaComponent, FormsModule],
  templateUrl: './metodopago.component.html',
  styleUrl: './metodopago.component.css'
})
export class MetodopagoComponent implements OnInit{
  tipoMedioPago!: number;
  TIPO_TARJETACREDITO !: number;
  TIPO_TRANSFERENCIA !: number;

  @Output() datosGuardados = new EventEmitter<any>();

  metodoPagoForm!: FormGroup;

  @ViewChild(DatostarjetaComponent) datostarjetaComp!: DatostarjetaComponent;

  // Método para exponer el FormGroup al padre
  getTarjetaFormGroup() {
    return this.datostarjetaComp?.datosTarjetaForm;
  }

  constructor(private fb: FormBuilder){
    this.TIPO_TARJETACREDITO = 1;
    this.TIPO_TRANSFERENCIA = 2;
  }

  ngOnInit(): void {
    this.metodoPagoForm = this.fb.group({});
    
  }
}
