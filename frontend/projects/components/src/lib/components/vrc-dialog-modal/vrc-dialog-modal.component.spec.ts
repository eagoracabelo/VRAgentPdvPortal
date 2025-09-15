import { VrcIconModule } from './../vrc-icon/vrc-icon.module';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrcDialogModalComponent } from './vrc-dialog-modal.component';

describe('VrcDialogModalComponent', () => {
  let component: VrcDialogModalComponent;
  let fixture: ComponentFixture<VrcDialogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcIconModule],
      declarations: [VrcDialogModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcDialogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
