import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IconStyleDirective } from './directives/icon-style.directive';
import { VrcIconComponent } from './vrc-icon.component';

describe('VrcIconComponent', () => {
  let component: VrcIconComponent;
  let fixture: ComponentFixture<VrcIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcIconComponent, IconStyleDirective],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
