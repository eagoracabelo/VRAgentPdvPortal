import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcNavToolbarComponent } from './vrc-nav-toolbar.component';

describe('VrcNavToolbarComponent', () => {
  let component: VrcNavToolbarComponent;
  let fixture: ComponentFixture<VrcNavToolbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcNavToolbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcNavToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
