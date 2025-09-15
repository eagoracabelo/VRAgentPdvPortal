import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VrcTabComponent } from './vrc-tab.component';

describe('VrcTabComponent', () => {
  let component: VrcTabComponent;
  let fixture: ComponentFixture<VrcTabComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcTabComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
