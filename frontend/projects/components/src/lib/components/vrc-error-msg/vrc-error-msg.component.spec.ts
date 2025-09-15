import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcErrorMsgComponent } from './vrc-error-msg.component';

describe('VrcErrorMsgComponent', () => {
  let component: VrcErrorMsgComponent;
  let fixture: ComponentFixture<VrcErrorMsgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcErrorMsgComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcErrorMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
