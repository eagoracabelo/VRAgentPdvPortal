import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { TableRowWrapperComponent } from './body-row-wrapper.component';

describe('TableRowWrapperComponent', () => {
  let fixture: ComponentFixture<TableRowWrapperComponent>;
  let component: TableRowWrapperComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableRowWrapperComponent],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TableRowWrapperComponent);
      component = fixture.componentInstance;
    });
  }));

  it('Component should be truth', () => {
    expect(component).toBeTruthy();
  });

  it('Componet should be emit onContextmenu', () => {
    const mouseEvent = <MouseEvent>{
      which: 2,
    };

    const spy = spyOn(component.rowContextmenu, 'emit').and.callThrough();
    component.onContextmenu(mouseEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should be getGroupHeader Style transform', () => {
    component.offsetX = 5;
    component.innerWidth = 6;
    const styles = component.getGroupHeaderStyle();
    const expectStyles = {
      transform: 'translate3d(5rem, 0rem, 0rem)',
      'backface-visibility': 'hidden',
      width: 6,
    };
    expect(styles).toEqual(expectStyles);
  });
});
