import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { DatosComponent } from './datos/datos.component';
import { DatosPasajeroComponent } from './datos/datospasajero/datospasajero.component';
import { MetodopagoComponent } from './datos/metodopago/metodopago.component';
import { ServiciosAdicionalesComponent } from './servicios-adicionales/servicios-adicionales.component';
import { ServicioRouterComponent } from './servicios-adicionales/servicio-router/servicio-router.component';
import { ResumenServiciosComponent } from './servicios-adicionales/resumen-servicios/resumen-servicios.component';

export const routes: Routes = [
  { path: '', redirectTo: 'busqueda', pathMatch: 'full' },
  { path: 'busqueda', component: InicioComponent },
  {
    path: 'reserva',
    component: DatosComponent,
    children: [
      { path: '', redirectTo: 'pasajeros', pathMatch: 'full' },
      { path: 'pasajeros', component: DatosPasajeroComponent },
      { path: 'servicios', component: ServiciosAdicionalesComponent },
      { path: 'servicios/:servicio', component: ServicioRouterComponent },
      { path: 'resumen-servicios', component: ResumenServiciosComponent },
      { path: 'pago', component: MetodopagoComponent },
    ],
  },
];