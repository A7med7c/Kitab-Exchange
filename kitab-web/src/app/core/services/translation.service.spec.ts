import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { LOCAL_STORAGE } from '../tokens/storage.token';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let documentRef: Document;
  const storage = new Map<string, string>();

  const translateStub = {
    addLangs: vi.fn(),
    setFallbackLang: vi.fn(),
    use: vi.fn(() => of({}))
  };

  beforeEach(() => {
    storage.clear();
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        TranslationService,
        { provide: TranslateService, useValue: translateStub },
        {
          provide: LOCAL_STORAGE,
          useValue: {
            getItem: (key: string) => storage.get(key) ?? null,
            setItem: (key: string, value: string) => storage.set(key, value)
          }
        }
      ]
    });

    service = TestBed.inject(TranslationService);
    documentRef = TestBed.inject(DOCUMENT);
  });

  it('initializes supported languages', async () => {
    await service.init();

    expect(translateStub.addLangs).toHaveBeenCalledWith(['en', 'ar']);
    expect(translateStub.setFallbackLang).toHaveBeenCalledWith('en');
    expect(translateStub.use).toHaveBeenCalledWith('en');
  });

  it('switches to Arabic and applies RTL document settings', async () => {
    await service.use('ar');

    expect(translateStub.use).toHaveBeenCalledWith('ar');
    expect(documentRef.documentElement.lang).toBe('ar');
    expect(documentRef.documentElement.dir).toBe('rtl');
    expect(documentRef.body.dir).toBe('rtl');
    expect(service.isRtl()).toBe(true);
  });

  it('toggles between English and Arabic', async () => {
    await service.use('en');
    service.toggle();

    expect(translateStub.use).toHaveBeenCalledWith('ar');
    expect(storage.get('kitab.language')).toBe('ar');
  });
});
