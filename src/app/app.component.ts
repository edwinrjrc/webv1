import { Component } from '@angular/core';
import { InicioComponent } from './inicio/inicio.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { DatosPasajeroComponent } from './datos/datospasajero/datospasajero.component';
import { MetodopagoComponent } from './datos/metodopago/metodopago.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InicioComponent, CabeceraComponent, DatosPasajeroComponent, MetodopagoComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '..:: Innova Viajes';
}
