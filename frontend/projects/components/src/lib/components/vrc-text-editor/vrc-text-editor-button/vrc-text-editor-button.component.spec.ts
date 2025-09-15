import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VrCommonModule } from '../../../vr-common.module';
import { VrcIconModule } from '../../vrc-icon';

import { VrcTextEditorButtonComponent } from './vrc-text-editor-button.component';

describe('VrcTextEditorButtonComponent', () => {
  let component: VrcTextEditorButtonComponent;
  let fixture: ComponentFixture<VrcTextEditorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VrcTextEditorButtonComponent],
      imports: [VrCommonModule, VrcIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTextEditorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
