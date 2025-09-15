import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ETokens } from '../../shared';
import { VrcNavSearchComponent } from './vrc-nav-search.component';
import { VrcNavSearchModule } from './vrc-nav-search.module';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VrcNavSearchComponent', () => {
  let component: VrcNavSearchComponent;
  let fixture: ComponentFixture<VrcNavSearchComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VrcNavSearchModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [VrcNavSearchComponent, TranslatorPipe],
      providers: [
        { provider: Router, useValue: { navigate: () => {} } },
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipe,
        },
        {
          provide: Location,
          useValue: {
            reload: () => {},
          },
        },
        {
          provide: window,
          useValue: {
            location: { reload: () => {} },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcNavSearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('listRoute', () => {
    it('Should call listRoute and not filter when user equal null  ', () => {
      component.getField('search').patchValue('busca');
      component.listRoute = [
        { rota: '', formularioLabel: '', formularioValue: 1, menuLabel: '' },
      ];
      expect(component.listRoute.length).toEqual(1);
    });
  });

  describe('filterFormularioPesquisa', () => {
    it('Should buscar when search length is >= 3', fakeAsync(() => {
      component.listRoute = [
        {
          menuLabel: 'Operação',
          subMenuLabel: 'Cadastro',
          formularioLabel: 'Pessoa',
          formularioValue: 1,
          rota: 'operacao/cadastro/Pessoa',
          label: 'Operação / Cadastro / Pessoa',
        },
        {
          menuLabel: 'Operação',
          subMenuLabel: 'Cadastro',
          formularioLabel: 'Produto',
          formularioValue: 1,
          rota: 'operacao/cadastro/Produto',
          label: 'Operação / Cadastro / Produto',
        },
      ];

      component.getField('search').patchValue('pro');

      tick(1000);

      expect(component.routefilteredList.length).toEqual(1);
      expect(component.routefilteredList).toEqual([
        {
          menuLabel: 'Operação',
          subMenuLabel: 'Cadastro',
          formularioLabel: 'Produto',
          formularioValue: 1,
          rota: 'operacao/cadastro/Produto',
          label: 'Operação / Cadastro / Produto',
        },
      ]);
    }));

    it('Should buscar when search length is ""', fakeAsync(() => {
      component.listRoute = [
        {
          menuLabel: 'Operação',
          subMenuLabel: 'Cadastro',
          formularioLabel: 'Pessoa',
          formularioValue: 1,
          rota: 'operacao/cadastro/Pessoa',
          label: 'Operação / Cadastro / Pessoa',
        },
        {
          menuLabel: 'Operação',
          subMenuLabel: 'Cadastro',
          formularioLabel: 'Produto',
          formularioValue: 1,
          rota: 'operacao/cadastro/Produto',
          label: 'Operação / Cadastro / Produto',
        },
      ];

      component.getField('search').patchValue('');

      tick(1000);

      expect(component.routefilteredList.length).toEqual(0);
      expect(component.routefilteredList).toEqual([]);
    }));
  });

  describe('buildLabel', () => {
    it('Should return label equal "Menu / SubMenu / Formulario" when subMenu is informed', () => {
      const mockComponent: any = component;
      const label = mockComponent.buildLabel(
        'Operacao',
        'Formulario',
        'Cadastro',
      );
      expect(label).toEqual('Operacao / Cadastro / Formulario');
    });

    it('Should return label equal "Menu / Formulario" when subMenu is not informed', () => {
      const mockComponent: any = component;
      const label = mockComponent.buildLabel('Operacao', 'Formulario');
      expect(label).toEqual('Operacao / Formulario');
    });
  });

  describe('HostListener onContextMenu', () => {
    it('should call onContextMenu and exec openInNewPage when exist ariaValueText', () => {
      const spy = spyOn(component, 'openInNewPage').and.returnValue();
      const event = {
        preventDefault: () => {},
        target: { ariaValueText: 'rota/teste' },
      } as unknown as Event;
      component.onContextMenu(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should call onContextMenu and not exec openInNewPage when not exist ariaValueText', () => {
      const spy = spyOn(component, 'openInNewPage').and.returnValue();
      const event = {
        preventDefault: () => {},
        target: { ariaValueText: null },
      } as unknown as Event;
      component.onContextMenu(event);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('HostListener mousedown', () => {
    it('should call mousedown and exec openInNewPage when exist ariaValueText and button is 1', () => {
      const spy = spyOn(component, 'openInNewPage').and.returnValue();

      const event = {
        button: 1,
        target: { ariaValueText: 'rota/teste' } as unknown as EventTarget,
      };
      component.onMouseDown(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should call mousedown and not exec openInNewPage when not exist ariaValueText and button is 1', () => {
      const spy = spyOn(component, 'openInNewPage').and.returnValue();

      const event = {
        button: 1,
        target: { ariaValueText: null } as unknown as EventTarget,
      };
      component.onMouseDown(event);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('HostListener onClick', () => {
    it('Should call onClick and exec redirectPage when className="label-page"', () => {
      component.reloadPage = function () {};
      const spy = spyOn(router, 'navigate').and.resolveTo(false);

      const event = {
        className: 'label-page',
        target: { className: 'label-page' },
      } as unknown as HTMLElement;

      component.onClick(event);
      expect(spy).toHaveBeenCalled();
    });
    it('Should call onClick and exec openInNewPage when className="label-new-page"', () => {
      const spy = spyOn(window, 'open').and.returnValue(null);

      const event = {
        className: 'label-new-page',
        target: { className: 'label-new-page' },
      } as unknown as HTMLElement;

      component.onClick(event);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('HostListener handleKeyDownEnter', () => {
    it('Should call handleKeyDownEnter and exec redirectPage when called', () => {
      component.reloadPage = function () {};
      const spy = spyOn(router, 'navigate').and.resolveTo(false);

      component.handleKeyDownEnter();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('redirectPage', () => {
    it('Should exec redirectPage when called ', () => {
      component.reloadPage = function () {};
      const spy = spyOn(router, 'navigate').and.resolveTo(false);
      component.getField('search').patchValue('router/test');
      component.redirectPage();
      expect(spy).toHaveBeenCalled();
    });
  });
});
