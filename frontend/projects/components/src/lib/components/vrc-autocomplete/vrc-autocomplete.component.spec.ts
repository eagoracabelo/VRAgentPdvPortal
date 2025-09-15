import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VrCommonModule } from './../../vr-common.module';
import { VrcAutocompleteComponent } from './vrc-autocomplete.component';

describe('VrcAutocompleteComponent', () => {
  let component: VrcAutocompleteComponent;
  let fixture: ComponentFixture<VrcAutocompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, VrCommonModule],
      declarations: [VrcAutocompleteComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
