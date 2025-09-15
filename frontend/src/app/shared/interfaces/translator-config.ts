import { Provider } from '@angular/core';

export interface TranslatorConfig {
  loader?: Provider;
  compiler?: Provider;
  parser?: Provider;
  isolate?: boolean;
  extend?: boolean;
  useDefaultLang?: boolean;
  defaultLanguage?: string;
}
