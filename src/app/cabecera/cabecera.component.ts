import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../_services/language.service';

@Component({
  selector: 'app-cabecera',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {
  constructor(public languageService: LanguageService) {}

  switchLanguage(lang: string): void {
    this.languageService.use(lang);
  }
}
