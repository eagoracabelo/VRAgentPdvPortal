import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcRadioGroupComponent } from './vrc-radio-group.component';

describe('VrcRadioGroupComponent', () => {
  let component: VrcRadioGroupComponent;
  let fixture: ComponentFixture<VrcRadioGroupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcRadioGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcRadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
