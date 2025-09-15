import { VrCommonModule } from './../../vr-common.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcTextareaComponent } from './vrc-textarea.component';

describe('VrcTextareaComponent', () => {
  let component: VrcTextareaComponent;
  let fixture: ComponentFixture<VrcTextareaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, VrCommonModule],
      declarations: [VrcTextareaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
