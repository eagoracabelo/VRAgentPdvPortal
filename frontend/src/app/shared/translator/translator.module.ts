import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { TranslatorConfig } from '../interfaces/translator-config';
import { TranslatorTextPipe } from '../pipes/translator-text.pipe';
import { TranslatorPipe } from '../pipes/translator.pipe';
import {
  DEFAULT_LANGUAGE,
  TranslatorService,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '../services/translator.service';
import { TranslatorLoader } from './translator-loader';
import { TranslateDefaultParser, TranslatorParser } from './translator-parser';
import { TranslatorStore } from './translator-store';

@NgModule({
  declarations: [TranslatorPipe, TranslatorTextPipe],
  exports: [TranslatorPipe, TranslatorTextPipe],
})
export class TranslatorModule {
  static forRoot(
    config: TranslatorConfig = {},
  ): ModuleWithProviders<TranslatorModule> {
    return {
      ngModule: TranslatorModule,
      providers: [
        config.loader || ({ provide: TranslatorLoader } as Provider),
        config.parser ||
          ({
            provide: TranslatorParser,
            useClass: TranslateDefaultParser,
          } as Provider),
        TranslatorStore,
        { provide: USE_STORE, useValue: config.isolate },
        { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
        { provide: USE_EXTEND, useValue: config.extend },
        { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
        TranslatorService,
      ],
    };
  }

  static forChild(
    config: TranslatorConfig = {},
  ): ModuleWithProviders<TranslatorModule> {
    return {
      ngModule: TranslatorModule,
      providers: [
        config.loader || ({ provide: TranslatorLoader } as Provider),
        config.parser ||
          ({
            provide: TranslatorParser,
            useClass: TranslateDefaultParser,
          } as Provider),
        { provide: USE_STORE, useValue: config.isolate },
        { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
        { provide: USE_EXTEND, useValue: config.extend },
        { provide: DEFAULT_LANGUAGE, useValue: config.defaultLanguage },
        TranslatorService,
      ],
    };
  }
}
