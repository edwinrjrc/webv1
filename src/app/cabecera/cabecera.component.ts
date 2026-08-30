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

  phoneNumber: string = '+51 999 888 777';

  constructor(public languageService: LanguageService) {}

  get telUrl(): string {
    return 'tel:' + this.phoneNumber.replace(/\s+/g, '');
  }

  switchLanguage(lang: string): void {
    this.languageService.use(lang);
  }
}
