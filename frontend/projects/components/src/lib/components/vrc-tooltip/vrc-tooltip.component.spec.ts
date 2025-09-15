import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Overlay } from '@angular/cdk/overlay';
import { EPositions } from './enums/positions.enum';
import { VrcTooltipComponent } from './vrc-tooltip.component';
import { VrcTooltipModule } from './vrc-tooltip.module';

describe('VrcTooltipComponent', () => {
  let component: VrcTooltipComponent;
  let fixture: ComponentFixture<VrcTooltipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VrcTooltipComponent],
      providers: [Overlay],
      imports: [VrcTooltipModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set tooltipHover to true on mouse enter', () => {
    component.onMouseEnter();
    expect(component.tooltipHover()).toBeTrue();
  });

  it('should set tooltipHover to false on mouse out', () => {
    component.onMouseOut();
    expect(component.tooltipHover()).toBeFalse();
  });

  it('should set position to BottomRight by default', () => {
    expect(component.position()).toBe(EPositions.BottomRight);
  });

  it('should set position to BottomLeft when bottomLeft is true', () => {
    component.bottomRight = false;
    component.bottomLeft = true;
    fixture.componentRef.setInput('tooltipOverlay', true);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.position()).toBe(EPositions.BottomLeft);
  });

  it('should set position to TopRight when topRight is true', () => {
    component.topRight = true;
    component.bottomRight = false;
    fixture.componentRef.setInput('tooltipOverlay', true);
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.position()).toBe(EPositions.TopRight);
  });

  it('should set position to TopLeft when topLeft is true', () => {
    component.topLeft = true;
    component.bottomRight = false;
    component.ngOnInit();
    expect(component.position()).toBe(EPositions.TopLeft);
  });

  it('should set position is not valid default cdkPositions is bottomRight', () => {
    component.topLeft = true;
    component.bottomRight = false;
    fixture.componentRef.setInput('tooltipOverlay', true);
    component.ngOnInit();
    console.log(component.cdkPositions());

    expect(component.cdkPositions()).toEqual([
      component['cdkPositionTopLeft'](),
    ]);
    component.position.set('Invalid' as EPositions);
    fixture.detectChanges();
    expect(component.cdkPositions()).toEqual([
      component['cdkPositionBottomRight'](),
    ]);
  });

  it('should compute cdkPositions correctly when tooltipOverlay is true', () => {
    fixture.componentRef.setInput('tooltipOverlay', true);
    fixture.detectChanges();
    component.position.set(EPositions.TopLeft);
    const positions = component.cdkPositions();
    expect(positions.length).toBe(1);
    expect(positions[0]).toEqual(component['cdkPositionTopLeft']());
  });

  it('should compute cdkPositions as empty when tooltipOverlay is false', () => {
    fixture.componentRef.setInput('tooltipOverlay', false);
    fixture.detectChanges();
    const positions = component.cdkPositions();
    expect(positions.length).toBe(0);
  });

  it('should set isArray to true if message is an array', () => {
    component.message = ['Message 1', 'Message 2'];
    component.ngOnInit();
    expect(component.isArray).toBeTrue();
  });

  it('should set isArray to false if message is a string', () => {
    component.message = 'Single Message';
    component.ngOnInit();
    expect(component.isArray).toBeFalse();
  });

  it('should add a style element for tooltip width if width is set', () => {
    const initialStyleCount = document.getElementsByTagName('style').length;
    component.width = 10;
    component.ngOnInit();
    const finalStyleCount = document.getElementsByTagName('style').length;
    expect(finalStyleCount).toBeGreaterThan(initialStyleCount);
  });

  it('should not add a style element for tooltip width if width is not set', () => {
    const initialStyleCount = document.getElementsByTagName('style').length;
    component.width = 0;
    component.ngOnInit();
    const finalStyleCount = document.getElementsByTagName('style').length;
    expect(finalStyleCount).toBe(initialStyleCount);
  });
});
