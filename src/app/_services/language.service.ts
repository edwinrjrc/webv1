import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'es' | 'en';

const STORAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE: SupportedLanguage = 'es';
const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['es', 'en'];

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  /**
   * Initializes the translation service.
   * Must be called once at app startup (e.g. in AppComponent.constructor).
   */
  init(): void {
    this.translate.addLangs(SUPPORTED_LANGUAGES);
    this.translate.setFallbackLang(DEFAULT_LANGUAGE);

    const saved = this.getSavedLanguage();
    this.translate.use(saved);
  }

  /** Returns the currently active language code. */
  get currentLang(): SupportedLanguage {
    return (this.translate.currentLang as SupportedLanguage) ?? DEFAULT_LANGUAGE;
  }

  /** Returns the list of supported language codes. */
  get supportedLanguages(): SupportedLanguage[] {
    return [...SUPPORTED_LANGUAGES];
  }

  /**
   * Switches the active language and persists the preference.
   * Falls back to the default language if the requested code is not supported.
   */
  use(lang: string): void {
    const target: SupportedLanguage = SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)
      ? (lang as SupportedLanguage)
      : DEFAULT_LANGUAGE;

    this.translate.use(target);
    this.saveLanguage(target);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private getSavedLanguage(): SupportedLanguage {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
        return stored as SupportedLanguage;
      }
    }
    return DEFAULT_LANGUAGE;
  }

  private saveLanguage(lang: SupportedLanguage): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }
}
