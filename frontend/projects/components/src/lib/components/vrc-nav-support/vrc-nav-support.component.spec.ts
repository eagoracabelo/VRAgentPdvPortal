import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrcNavSuporteComponent } from './vrc-nav-support.component';
import { VrcNavSuporteModule } from './vrc-nav-support.module';

describe('VrcNavSuporteComponent', () => {
  let component: VrcNavSuporteComponent;
  let fixture: ComponentFixture<VrcNavSuporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcNavSuporteModule],
      declarations: [VrcNavSuporteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcNavSuporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
