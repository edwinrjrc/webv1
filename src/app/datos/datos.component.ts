import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { DatosPasajeroComponent } from './datospasajero/datospasajero.component';
import { MetodopagoComponent } from './metodopago/metodopago.component';
import { ContactoemergenciaComponent } from './contactoemergencia/contactoemergencia.component';
import { DatosPasajero } from '../modelo/datospasajero';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { DatostarjetaComponent } from './datostarjeta/datostarjeta.component';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [
    DatosPasajeroComponent,
    MetodopagoComponent,
    CommonModule, NgbProgressbarModule, DatostarjetaComponent
  ],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css',
})
export class DatosComponent implements AfterViewInit{
  @ViewChild(DatosPasajeroComponent)
  datosPasajeroComponent!: DatosPasajeroComponent;

  @ViewChild(DatostarjetaComponent)
  datostarjetaComponent!: DatostarjetaComponent;

  @ViewChild(MetodopagoComponent) metodopagoComp!: MetodopagoComponent;

  constructor() {
    console.log('DatosComponent initialized');
  }

  ngAfterViewInit(): void {
    // Aquí puedes acceder a formularioHijo de forma segura
    // Por ejemplo, para verificar si se inicializó correctamente:
    console.log('ngAfterViewInit');
    if (this.datosPasajeroComponent) {
      console.log('Formulario hijo cargado en ngAfterViewInit');
      // Puedes acceder a sus propiedades como this.formularioHijo.personaForm aquí si necesitas.
      // Pero para tu caso de guardar, el acceso se hará en guardarDatos(), que es posterior.
    } else {
      console.error('El formulario hijo no se cargó correctamente.');
    }
  }

  guardarDatosVenta() {
    console.log('Guardar Datos');
    console.log('datosPasajeroComponent ::'+this.datosPasajeroComponent);
    console.log('datostarjetaComponent ::'+this.datostarjetaComponent);
    const form = this.metodopagoComp?.getTarjetaFormGroup();
    if (this.datosPasajeroComponent.pasajeroForm || this.metodopagoComp?.getTarjetaFormGroup() ) {
      // Para Reactive Forms
      this.datosPasajeroComponent.pasajeroForm.markAllAsTouched();
      this.metodopagoComp?.getTarjetaFormGroup().markAllAsTouched();
    }
  }

  manejarDatosGuardados(datos: any) {
    console.log('Datos recibidos del hijo:', datos);
    // Aquí podrías procesar o guardar los datos
  }
}
