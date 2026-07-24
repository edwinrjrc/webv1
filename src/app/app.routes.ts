import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { DatosComponent } from './datos/datos.component';
import { DatosPasajeroComponent } from './datos/datospasajero/datospasajero.component';
import { MetodopagoComponent } from './datos/metodopago/metodopago.component';

export const routes: Routes = [
  { path: '', redirectTo: 'busqueda', pathMatch: 'full' },
  { path: 'busqueda', component: InicioComponent },
  {
    path: 'reserva',
    component: DatosComponent,
    children: [
      { path: '', redirectTo: 'pasajeros', pathMatch: 'full' },
      { path: 'pasajeros', component: DatosPasajeroComponent },
      { path: 'pago', component: MetodopagoComponent },
    ],
  },
];