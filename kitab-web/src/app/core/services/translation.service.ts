import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LOCAL_STORAGE } from '../tokens/storage.token';

type SupportedLanguage = (typeof environment.supportedLanguages)[number];

const LANGUAGE_KEY = 'kitab.language';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(LOCAL_STORAGE);
  private readonly languageState = signal<SupportedLanguage>(this.resolveInitialLanguage());

  readonly language = this.languageState.asReadonly();
  readonly isRtl = signal(this.languageState() === 'ar');

  init(): Promise<void> {
    this.translate.addLangs([...environment.supportedLanguages]);
    this.translate.setFallbackLang(environment.defaultLanguage);
    return firstValueFrom(this.translate.use(this.languageState())).then(() => {
      this.applyDocumentDirection(this.languageState());
    });
  }

  use(language: SupportedLanguage): Promise<void> {
    this.languageState.set(language);
    this.isRtl.set(language === 'ar');
    this.storage?.setItem(LANGUAGE_KEY, language);

    return firstValueFrom(this.translate.use(language)).then(() => {
      this.applyDocumentDirection(language);
    });
  }

  toggle(): void {
    const next = this.languageState() === 'en' ? 'ar' : 'en';
    void this.use(next);
  }

  private applyDocumentDirection(language: SupportedLanguage): void {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    this.document.documentElement.lang = language;
    this.document.documentElement.dir = direction;
    this.document.body.dir = direction;
  }

  private resolveInitialLanguage(): SupportedLanguage {
    const saved = this.storage?.getItem(LANGUAGE_KEY);
    return saved === 'ar' || saved === 'en' ? saved : environment.defaultLanguage;
  }
}
