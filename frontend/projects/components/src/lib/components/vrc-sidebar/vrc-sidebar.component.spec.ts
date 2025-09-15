import { Pipe, PipeTransform, Renderer2, Type } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { ETokens } from '../../shared';
import { IJSONObject } from '../../shared/interfaces/json-object.interface';
import { VrcIconModule } from '../vrc-icon';

import { VrcSidebarComponent } from './vrc-sidebar.component';
import { VrcSidebarModule } from './vrc-sidebar.module';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VrcSidebarComponent', () => {
  let component: VrcSidebarComponent;
  let fixture: ComponentFixture<VrcSidebarComponent>;
  let renderer2: Renderer2;

  const menuItens: IJSONObject[] = [
    {
      id: 1,
      titulo: 'Produto',
      tooltip: 'Cadastro de Produtos',
      icone: 'produto',
      rota: '/produto',
      submenu: [],
    },
    {
      id: 2,
      titulo: 'Forms',
      tooltip: 'Forms',
      icone: 'marcador',
      rota: '/componentes/forms',
      submenu: [
        {
          id: 3,
          titulo: 'Autocomplete',
          tooltip: 'Autocomplete',
          icone: 'marcador',
          rota: '/componentes/forms/autocomplete',
          submenu: [],
        },
      ],
    },
  ] as IJSONObject[];

  const events$ = new Subject<NavigationEnd>();

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: events$,
    url: '/produto',
    createUrlTree: jasmine.createSpy('createUrlTree'),
    serializeUrl: jasmine.createSpy('serializeUrl'),
  };

  const mockActivatedRoute = {
    root: {
      firstChild: {
        routeConfig: {
          data: {
            breadcrumb: [{ text: 'rede cadastro', link: 'cadastro' }],
          },
          path: 'rede',
        },
      },
      routeConfig: {
        data: {
          breadcrumb: [{ text: 'rede', link: 'consulta' }],
        },
        path: 'rede',
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, VrcIconModule, VrcSidebarModule],
      declarations: [VrcSidebarComponent, TranslatorPipe],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipe,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.menuItens = menuItens;
    renderer2 = fixture.componentRef.injector.get<Renderer2>(
      Renderer2 as Type<Renderer2>,
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sidebarLevel to 1 and add style to body on init', () => {
    const spy = spyOn(renderer2, 'addClass').and.callThrough();

    component.ngOnInit();

    expect(component.sidebarLevel).toEqual(1);
    expect(spy).toHaveBeenCalledWith(document.body, 'main-sidebar--middle');
  });

  describe('toggleSidebar', () => {
    it('should sidebarLevel initial value be 1 and sidebar should show both arrow buttons', () => {
      expect(component.sidebarLevel).toEqual(1);
      expect(component.isSidebarRightLevel()).toEqual(true);
      expect(component.isSidebarLeftLevel()).toEqual(true);
    });

    it('should sidebarLevel be increasead to 2 and sidebar should show only left arrow button', () => {
      const spyAdd = spyOn(renderer2, 'addClass').and.callThrough();
      const spyRemove = spyOn(renderer2, 'removeClass').and.callThrough();

      component.toggleSidebar(0, 1);

      expect(component.sidebarLevel).toEqual(2);
      expect(component.isSidebarRightLevel()).toEqual(false);
      expect(component.isSidebarLeftLevel()).toEqual(true);
      expect(spyRemove).toHaveBeenCalledWith(
        document.body,
        'main-sidebar--middle',
      );
      expect(spyAdd).toHaveBeenCalledWith(document.body, 'main-sidebar--full');
    });

    it('should sidebarLevel be decreased to 0 and sidebar should show only right arrow button', () => {
      const spyAdd = spyOn(renderer2, 'addClass').and.callThrough();
      const spyRemove = spyOn(renderer2, 'removeClass').and.callThrough();

      component.toggleSidebar(1, 0);

      expect(component.sidebarLevel).toEqual(0);
      expect(component.isSidebarRightLevel()).toEqual(true);
      expect(component.isSidebarLeftLevel()).toEqual(false);
      expect(spyRemove).toHaveBeenCalledWith(
        document.body,
        'main-sidebar--middle',
      );
      expect(spyAdd).toHaveBeenCalledWith(
        document.body,
        'main-sidebar--hidden',
      );
    });
  });

  describe('forceHiddenToggleButton and removeForcedHidden', () => {
    const dummyElement = document.createElement('button');
    dummyElement.setAttribute('class', 'main-sidebar__toggle-arrow');

    document.body.appendChild(dummyElement);

    it('should force opacity to zero', () => {
      component.forceHiddenToggleButton();
      expect(dummyElement.style.opacity).toEqual('0');
    });

    it('should force opacity to empty', () => {
      component.removeForcedHidden();
      expect(dummyElement.style.opacity).toEqual('');
    });

    it('should not make changes if the element doesnt exist', () => {
      const spy = spyOn(document, 'getElementsByClassName').and.returnValue(
        [] as any,
      );
      component.forceHiddenToggleButton();
      expect(spy).toHaveBeenCalled();
    });

    it('should not make changes if the element doesnt exist', () => {
      const spy = spyOn(document, 'getElementsByClassName').and.returnValue(
        [] as any,
      );
      component.removeForcedHidden();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('watchUrl', () => {
    it('should call iterateMenu when navigation ends', fakeAsync(() => {
      const component = fixture.componentInstance;

      const spy = spyOn(component, 'iterateMenu');

      events$.next(
        new NavigationEnd(
          1,
          '/componentes/forms/autocomplete',
          '/componentes/forms/autocomplete',
        ),
      );

      tick(500);
      expect(spy).toHaveBeenCalledWith(
        menuItens,
        '/componentes/forms/autocomplete',
      );
    }));
  });

  describe('iterateMenu', () => {
    it('should call when called', () => {
      const router = '/operacao/cadastro/produto';

      const spy = spyOn(component, 'iterateMenu').and.callThrough();

      component.iterateMenu(component.menuItens, router);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('toggleActiveMenuItem', () => {
    it('should call when called with DIV', () => {
      const id = 2000;
      const div = document.createElement('div');
      div.id = `${id}`;
      spyOn(document, 'getElementById').and.returnValue(div);

      const spy = spyOn(component, 'toggleActiveMenuItem').and.callThrough();

      component.toggleActiveMenuItem(id, true);

      expect(spy).toHaveBeenCalled();
    });

    it('should call when called with SPAN', () => {
      const id = 2000;
      const span = document.createElement('span');
      span.id = `${id}`;
      spyOn(document, 'getElementById').and.returnValue(span);

      const spy = spyOn(component, 'toggleActiveMenuItem').and.callThrough();

      component.toggleActiveMenuItem(id, false);

      expect(spy).toHaveBeenCalled();
    });
  });
});
