import { TestBed } from '@angular/core/testing';

import { VrAutocompleteService } from './vr-autocomplete.service';

describe('VrAutocompleteService', () => {
  let service: VrAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VrAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
