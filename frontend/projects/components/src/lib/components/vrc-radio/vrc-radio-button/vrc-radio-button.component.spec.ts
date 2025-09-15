import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcRadioButtonComponent } from './vrc-radio-button.component';

describe('VrcRadioButtonComponent', () => {
  let component: VrcRadioButtonComponent;
  let fixture: ComponentFixture<VrcRadioButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcRadioButtonComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
