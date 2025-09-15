import { Injector } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';

import { ModalRef } from '../../modal/references/modal-ref';
import { TranslatePipe } from './../../../../pipes/translate.pipe';
import { TranslationService } from './../../../../services/translation.service';
import { PdfConfigComponent } from './../../modal/components/pdf-config/pdf-config.component';
import { ExportFileComponent } from './export-file.component';

describe('ExportFileComponent', () => {
  let component: ExportFileComponent;
  let fixture: ComponentFixture<ExportFileComponent>;
  let translationService: TranslationService;

  const rows = [
    {
      age: 22,
      company: 'Johnson, Johnson and Partners, LLC CMP DDC',
      gender: 'female',
      name: 'Ethel Price',
    },
  ];

  const columns = [
    {
      prop: 'age',
    },
    {
      prop: 'company',
    },
    {
      prop: 'gender',
    },
    {
      prop: 'name',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportFileComponent, TranslatePipe],
      providers: [Injector, ModalRef, TranslationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFileComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Should translate values', () => {
    it('Should set pt-BR translations', fakeAsync(() => {
      translationService.loadTranslation('pt-BR').subscribe();
      tick(100);

      let element = fixture.nativeElement.querySelector(
        '.table-tools-export-content',
      ) as HTMLUListElement;

      expect(element.firstChild?.textContent?.trim()).toBe(
        'Exportar e enviar arquivos',
      );
    }));

    it('Should set en-US translations', fakeAsync(() => {
      translationService.loadTranslation('en-US').subscribe();
      tick(100);
      let element = fixture.nativeElement.querySelector(
        '.table-tools-export-content',
      ) as HTMLUListElement;

      expect(element.firstChild?.textContent?.trim()).toBe(
        'Export and send files',
      );
    }));

    it('Should set es-ES translations', fakeAsync(() => {
      translationService.loadTranslation('es-ES').subscribe();
      tick(100);

      let element = fixture.nativeElement.querySelector(
        '.table-tools-export-content',
      ) as HTMLUListElement;

      expect(element.firstChild?.textContent?.trim()).toBe(
        'Exportar y enviar archivos',
      );
    }));
  });

  describe('Input', () => {
    it('rows e columns', () => {
      component.rows = rows;
      component.columns = columns as any;

      expect(component.rows).toEqual(rows);
      expect(component.columns).toEqual(columns as any);
    });
  });

  describe('toggleTablesToolsExport', () => {
    it('Variável _isTablesToolsExportOpen deve ser false', () => {
      const exportFileComponent: any = component;

      expect(exportFileComponent._isTablesToolsExportOpen).toBeFalsy();
    });

    it('Variável _isTablesToolsExportOpen deve ser true', () => {
      const exportFileComponent: any = component;
      component.toggleTablesToolsExport();

      expect(exportFileComponent._isTablesToolsExportOpen).toBeTrue();
    });
  });

  describe('setFileType', () => {
    it('Variável fileType deve estar indefinida', () => {
      expect(component.fileType).toBeUndefined();
    });

    it('Variável fileType deve estar definida e conter o valor pdf', () => {
      component.setFileType('pdf');
      expect(component.fileType).toBeDefined();
      expect(component.fileType).toEqual('pdf');
    });
  });

  describe('applyFile', () => {
    it('Variável fileType deve estar indefinida', () => {
      component.applyFile();
      expect(component.fileType).toBeUndefined();
    });

    /* it('Variável fileType deve estar definida e conter o valor pdf', () => {
      const exportFileComponent: any = component;

      const spy = spyOn(exportFileComponent, 'generateFile');

      component.setFileType('pdf');

      fixture.detectChanges();

      component.applyFile();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(component.fileType).toBeDefined();
      expect(component.fileType).toEqual('pdf');
    }); */

    /* it('Variável fileType deve estar definida e conter o valor xls', () => {
      const exportFileComponent: any = component;

      const spy = spyOn(exportFileComponent, 'generateFile');

      component.setFileType('xls');

      fixture.detectChanges();

      component.applyFile();

      expect(spy).toHaveBeenCalled();
      expect(component.fileType).toBeDefined();
      expect(component.fileType).toEqual('xls');
    }); */

    /* it('Variável fileType deve estar definida e conter o valor txt', () => {
      const exportFileComponent: any = component;

      const spy = spyOn(exportFileComponent, 'generateFile');

      component.setFileType('txt');

      component.applyFile();

      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(component.fileType).toBeDefined();
      expect(component.fileType).toEqual('txt');
    }); */

    /* it('Variável fileType deve estar indefinida e ao passar um valor não valido retorne um exceção', () => {
      const fileType: any = 'tty';
      component.setFileType(fileType);

      expect(component.applyFile()).toThrow(new Error(`Can't export unknown data type ${fileType}.`));
    }); */
  });

  describe('generateFile', () => {
    it('generateFile deve ser chamado', () => {
      const exportFileComponent: any = component;

      const values = {
        printColumns: ['name', 'gender', 'company', 'age'],
        printPageType: 'current', // all
        printType: 'portrait',
      };

      spyOn(component, 'refExportFrom').and.callFake(
        async () => Promise.resolve(true) as any,
      );

      spyOn(exportFileComponent, 'printPageOptions').and.callFake(() => values);

      const spy = spyOn(exportFileComponent, 'modalInstance').and.callFake(
        () => {
          return {
            afterOk: of({
              ...values,
            }),
          };
        },
      );

      exportFileComponent.generateFile(PdfConfigComponent, 'pdf');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('modalInstance', () => {
    it('Deve retornar uma instancia de ModalRef', () => {
      const values = {
        printColumns: ['name', 'gender', 'company', 'age'],
        printPageType: 'current',
        printType: 'portrait',
      };

      const exportFileComponent: any = component;

      const ref = exportFileComponent.modalInstance(PdfConfigComponent);

      ref.ok(values);

      expect(ref).toBeDefined();
    });
  });
});
