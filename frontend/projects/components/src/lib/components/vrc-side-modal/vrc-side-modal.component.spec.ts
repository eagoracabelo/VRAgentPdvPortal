import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VrcSideModalModule } from '.';
import { VrcSideModalComponent } from './vrc-side-modal.component';

describe('VrcSideModalComponent', () => {
  let component: VrcSideModalComponent;
  let fixture: ComponentFixture<VrcSideModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VrcSideModalModule],
      declarations: [VrcSideModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcSideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle side modal', () => {
    component.toggleSideModal();
    expect(component.active).toBeTrue();
  });

  describe('pinToDrag', () => {
    it('should pin to drag when isDragable is true and active is true', () => {
      component.isDragable = true;
      component.active = true;

      component.pinToDrag();

      expect(component.drag).toBeTrue();
    });

    it('should not pin to drag when isDragable is true', () => {
      component.isDragable = false;
      component.active = true;

      component.pinToDrag();

      expect(component.drag).toBeTrue();
    });

    it('should be pin to drag when isDragable is true', () => {
      component.isDragable = true;
      component.active = true;
      component.drag = true;

      expect(component.dragPosition).toBeNull();

      component.pinToDrag();

      expect(component.dragPosition).toEqual({ x: 0, y: 0 });
    });

    it('should not pin to drag when active is false', () => {
      component.isDragable = true;
      component.active = false;

      component.pinToDrag();

      expect(component.drag).toBeFalse();
    });
  });
  describe('toggleSideModal', () => {
    it('should toggle side modal', () => {
      component.isDragable = true;
      component.drag = false;
      component.active = false;

      component.toggleSideModal();

      expect(component.drag).toBeFalse();
      expect(component.active).toBeTrue();
    });

    it('should not toggle side modal when drag is true', () => {
      component.isDragable = true;
      component.drag = true;
      component.active = false;

      component.toggleSideModal();

      expect(component.drag).toBeTrue();
      expect(component.active).toBeFalse();
    });

    it('should toggle side modal when drag is false', () => {
      component.isDragable = true;
      component.drag = false;
      component.active = true;

      component.toggleSideModal();

      expect(component.drag).toBeFalse();
      expect(component.active).toBeFalse();
    });

    it('should toggle side modal when isDragable is false', () => {
      component.isDragable = false;
      component.drag = false;
      component.active = false;

      component.toggleSideModal();

      expect(component.drag).toBeFalse();
      expect(component.active).toBeTrue();
    });
  });

  describe('dragableParentClass', () => {
    it('should set dragableParentClass when value starts with "."', () => {
      const value = '.parent-class';

      component.dragableParentClass = value;

      expect(component['_dragableParentClass']).toEqual(value);
    });

    it('should set dragableParentClass when value starts with "#"', () => {
      const value = '#parent-id';

      component.dragableParentClass = value;

      expect(component['_dragableParentClass']).toEqual(value);
    });

    it('should set dragableParentClass when value does not start with "." or "#"', () => {
      const value = 'parent-class';

      component.dragableParentClass = value;

      expect(component['_dragableParentClass']).toEqual(`.${value}`);
    });

    it('should not set dragableParentClass when value is not a string', () => {
      const value = 123;

      component.dragableParentClass = value as any;

      expect(component.dragableParentClass).toBe('.content-wrapper');
    });
  });
});
