import { InjectionToken } from '@angular/core';

export const LOCATION_TOKEN = new InjectionToken<Location>(
  'Window location object',
);

export const LOCATION_TOKEN_PROVIDER = {
  provide: LOCATION_TOKEN,
  useValue: window.location,
};
