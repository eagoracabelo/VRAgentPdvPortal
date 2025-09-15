import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VrcCardValueComponent, VrcCardValueModule } from '.';

describe('VrcCardValueComponent', () => {
  let component: VrcCardValueComponent;
  let fixture: ComponentFixture<VrcCardValueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VrcCardValueModule],
      declarations: [VrcCardValueComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcCardValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value and transform to string', () => {
    component.value = 0;
    expect(component.value).toEqual('0');
  });

  it('should set secondaryValue and transform to string', () => {
    component.secondaryValue = 0;
    expect(component.secondaryValue).toEqual('0');
  });
});
