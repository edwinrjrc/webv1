import { Component } from '@angular/core';
import { DatosPasajeroComponent } from './datospasajero/datospasajero.component';
import { MetodopagoComponent } from './metodopago/metodopago.component';
import { ContactoemergenciaComponent } from './contactoemergencia/contactoemergencia.component';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [DatosPasajeroComponent, MetodopagoComponent, ContactoemergenciaComponent],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent {

  guardarDatosVenta(){
    console.log('Guardar Datos');
  }
}
