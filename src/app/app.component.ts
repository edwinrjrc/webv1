import { Component } from '@angular/core';
import { InicioComponent } from './inicio/inicio.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { DatosPasajeroComponent } from './datos/datospasajero/datospasajero.component';
import { MetodopagoComponent } from './datos/metodopago/metodopago.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from './_services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InicioComponent, CabeceraComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '..:: Innova Viajes';

  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
