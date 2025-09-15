import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcOptionComponent } from './vrc-option.component';

describe('VrcOptionComponent', () => {
  let component: VrcOptionComponent;
  let fixture: ComponentFixture<VrcOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcOptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
