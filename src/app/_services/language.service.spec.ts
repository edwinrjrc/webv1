import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';
import { PLATFORM_ID } from '@angular/core';

describe('LanguageService', () => {
  let service: LanguageService;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        LanguageService,
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(LanguageService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have "es" as fallback language after init', () => {
    service.init();
    // After init, the current lang should be 'es' (the stored/default)
    expect(service.currentLang).toBe('es');
  });

  it('should expose supported languages', () => {
    const langs = service.supportedLanguages;
    expect(langs).toContain('es');
    expect(langs).toContain('en');
    expect(langs.length).toBe(2);
  });

  it('should switch to "en" when use("en") is called', () => {
    service.init();
    service.use('en');
    expect(service.currentLang).toBe('en');
  });

  it('should fall back to "es" for unsupported language codes', () => {
    service.init();
    service.use('fr');
    expect(service.currentLang).toBe('es');
  });

  it('should switch back to "es"', () => {
    service.init();
    service.use('en');
    service.use('es');
    expect(service.currentLang).toBe('es');
  });
});
