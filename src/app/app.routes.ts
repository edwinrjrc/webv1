import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { DatosComponent } from './datos/datos.component';
import { DatosPasajeroComponent } from './datos/datospasajero/datospasajero.component';
import { MetodopagoComponent } from './datos/metodopago/metodopago.component';
import { ServiciosAdicionalesComponent } from './servicios-adicionales/servicios-adicionales.component';
import { ServicioRouterComponent } from './servicios-adicionales/servicio-router/servicio-router.component';
import { ResumenServiciosComponent } from './servicios-adicionales/resumen-servicios/resumen-servicios.component';
import { ResultadoRentacarroComponent } from './resultados/resultado-rentacarro/resultado-rentacarro.component';
import { ResultadoPaquetesComponent } from './resultados/resultado-paquetes/resultado-paquetes.component';
import { ResultadoToursComponent } from './resultados/resultado-tours/resultado-tours.component';
import { ResultadoSeguroViajeComponent } from './resultados/resultado-seguro-viaje/resultado-seguro-viaje.component';
import { ResultadoSegurosComponent } from './resultados/resultado-seguros/resultado-seguros.component';

export const routes: Routes = [
  { path: '', redirectTo: 'busqueda', pathMatch: 'full' },
  { path: 'busqueda', component: InicioComponent },
  { path: 'resultados/rentacarro', component: ResultadoRentacarroComponent },
  { path: 'resultados/paquetes', component: ResultadoPaquetesComponent },
  { path: 'resultados/tours', component: ResultadoToursComponent },
  { path: 'resultados/seguro-viaje', component: ResultadoSeguroViajeComponent },
  { path: 'resultados/seguros', component: ResultadoSegurosComponent },
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