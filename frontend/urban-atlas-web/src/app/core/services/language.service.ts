import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const LANG_KEY = 'ua_language';
const DEFAULT_LANG = 'pt-BR';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly languages = [
    { code: 'pt-BR', label: '🇧🇷 Português' },
    { code: 'en', label: '🇺🇸 English' }
  ];

  constructor(private readonly translate: TranslateService) {}

  /** Call once at app startup to configure translate and restore persisted language. */
  init(): void {
    this.translate.addLangs(['en', 'pt-BR']);
    const saved = localStorage.getItem(LANG_KEY) ?? DEFAULT_LANG;
    this.translate.use(saved);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem(LANG_KEY, lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang ?? DEFAULT_LANG;
  }
}


