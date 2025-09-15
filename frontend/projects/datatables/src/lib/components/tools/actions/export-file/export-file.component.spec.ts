import { Pipe, PipeTransform, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VrcIconModule } from '@vrsoftbr/vr-components';
import { of } from 'rxjs';
import { ETokens } from '../../../../enums/tokens.enum';
import { TranslatorPipe } from '../../../../pipes/translator.pipe';
import { ExportFileComponent } from './export-file.component';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('ExportFileComponent', () => {
  let component: ExportFileComponent;
  let fixture: ComponentFixture<ExportFileComponent>;

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
      label: 'age',
      summaryCurrency: true,
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
      declarations: [ExportFileComponent, TranslatorPipe],
      providers: [
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
      imports: [VrcIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFileComponent);
    component = fixture.componentInstance;
    component.fileTitle = 'Test';
    component.storageKeyColumnPrintingPreference = 'test';
    component.columns = columns as any;
    component.rows = rows;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle datatables tools export', () => {
    expect(component.isDatatablesToolsExportOpen).toBeFalse();
    component.toggleDatatablesToolsExport();
    expect(component.isDatatablesToolsExportOpen).toBeTrue();
    component.toggleDatatablesToolsExport();
    expect(component.isDatatablesToolsExportOpen).toBeFalse();
  });

  it('should set file type', () => {
    expect(component.fileType).toBeUndefined();
    component.setFileType('pdf');
    expect(component.fileType).toEqual('pdf');
  });

  it('should apply file pdf', () => {
    component.fileType = 'pdf';
    component.applyFile();
    expect(component.fileType).toBe('pdf');
  });

  it('should apply file xls', () => {
    component.fileType = 'xls';
    component.applyFile();
    expect(component.fileType).toBe('xls');
  });

  it('should apply file txt', () => {
    component.fileType = 'txt';
    component.applyFile();
    expect(component.fileType).toBe('txt');
  });

  it('should apply file txt modal instance and columns is equal', () => {
    const values = {
      printColumns: ['age'],
      printPageType: 'current',
      printType: 'portrait',
    };
    component.fileType = 'txt';
    (component as any)._columnPrintingPreference = [
      {
        id: 1,
        key: 'test',
        column: 'age',
      },
    ];
    spyOn(component, 'refExportFrom').and.callFake(async () =>
      Promise.resolve(),
    );
    const spy = spyOn(component as any, 'modalInstance').and.callFake(() => {
      return {
        afterOk: of({
          ...values,
        }),
      };
    });
    component.applyFile();
    expect(spy).toHaveBeenCalled();
  });

  it('should apply file txt modal instance and columns not equal', () => {
    const values = {
      printColumns: ['id'],
      printPageType: 'all',
      printType: 'portrait',
    };
    component.fileType = 'txt';
    (component as any)._columnPrintingPreference = [
      {
        id: 1,
        key: 'test',
        column: 'name',
      },
    ];
    spyOn(component, 'refExportFrom').and.callFake(async () =>
      Promise.resolve(),
    );
    const spy = spyOn(component as any, 'modalInstance').and.callFake(() => {
      return {
        afterOk: of({
          ...values,
        }),
      };
    });
    component.applyFile();
    expect(spy).toHaveBeenCalled();
  });

  it('should be error apply file not exists', () => {
    component.fileType = 'png' as any;
    try {
      component.applyFile();
    } catch (error: any) {
      expect(error.message).toBe("Can't export unknown data type png.");
    }
  });

  it('should be fileType undefined', () => {
    component.fileType = undefined as any;

    component.applyFile();
    expect(component.fileType).toBeUndefined();
  });

  it('should translate rows', () => {
    component.columns = [
      { prop: 'name', translate: true, visibleColumn: true },
      { prop: 'age', situation: true, visibleColumn: true },
    ];
    component.rows = [
      { name: 'John Doe', age: 25, active: true },
      { name: 'Jane Smith', age: 30, active: false },
    ];

    const translatedRows = component.translateRows();

    expect(translatedRows).toEqual([
      {
        name: 'John Doe',
        age: 'COMMONS.ACTIVE',
        active: true,
      },
      {
        name: 'Jane Smith',
        age: 'COMMONS.ACTIVE',
        active: false,
      },
    ]);
  });

  afterEach(() => {
    fixture.destroy();
  });
});

describe('ExportFileComponent - currency', () => {
  let component: ExportFileComponent;
  let fixture: ComponentFixture<ExportFileComponent>;

  const currencySignal = signal('BRL');

  const rows = [
    {
      age: 22,
      currency: 1000.0,
      money: '1000,0',
      discount: '1000.0',
      currencyNotNumber: 'aaaa',
      currencyNotIso: 1000.0,
      currencySignal: 10000.0,
    },
  ];

  const columns = [
    {
      prop: 'age',
      label: 'age',
      summaryCurrency: true,
    },
    {
      prop: 'currency',
      currency: 'BRL',
    },
    {
      prop: 'money',
      currency: 'BRL',
    },
    {
      prop: 'discount',
      currency: 'BRL',
    },
    {
      prop: 'currencyNotNumber',
      currency: 'BRL',
    },
    {
      prop: 'currencyNotIso',
      currency: 'TEST',
    },
    {
      prop: 'currencySignal',
      currency: currencySignal,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExportFileComponent, TranslatorPipe],
      providers: [
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
      imports: [VrcIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFileComponent);
    component = fixture.componentInstance;
    component.fileTitle = 'Test';
    component.storageKeyColumnPrintingPreference = 'test';
    component.columns = columns as any;
    component.rows = rows;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle datatables tools export', () => {
    expect(component.isDatatablesToolsExportOpen).toBeFalse();
    component.toggleDatatablesToolsExport();
    expect(component.isDatatablesToolsExportOpen).toBeTrue();
    component.toggleDatatablesToolsExport();
    expect(component.isDatatablesToolsExportOpen).toBeFalse();
  });

  it('should set file type', () => {
    expect(component.fileType).toBeUndefined();
    component.setFileType('pdf');
    expect(component.fileType).toEqual('pdf');
  });

  it('should apply file pdf', () => {
    component.fileType = 'pdf';
    component.applyFile();
    expect(component.fileType).toBe('pdf');
  });

  it('should apply file xls', () => {
    component.fileType = 'xls';
    component.applyFile();
    expect(component.fileType).toBe('xls');
  });

  it('should apply file txt', () => {
    component.fileType = 'txt';
    component.applyFile();
    expect(component.fileType).toBe('txt');
  });

  it('should apply file txt modal instance and columns is equal', () => {
    const values = {
      printColumns: ['age'],
      printPageType: 'current',
      printType: 'portrait',
    };
    component.fileType = 'txt';
    (component as any)._columnPrintingPreference = [
      {
        id: 1,
        key: 'test',
        column: 'age',
      },
    ];
    spyOn(component, 'refExportFrom').and.callFake(async () =>
      Promise.resolve(),
    );
    const spy = spyOn(component as any, 'modalInstance').and.callFake(() => {
      return {
        afterOk: of({
          ...values,
        }),
      };
    });
    component.applyFile();
    expect(spy).toHaveBeenCalled();
  });

  it('should apply file txt modal instance and columns is equal and int error', () => {
    spyOn(Intl, 'NumberFormat').and.throwError('error');
    const values = {
      printColumns: ['age'],
      printPageType: 'current',
      printType: 'portrait',
    };
    component.fileType = 'txt';
    (component as any)._columnPrintingPreference = [
      {
        id: 1,
        key: 'test',
        column: 'age',
      },
    ];
    spyOn(component, 'refExportFrom').and.callFake(async () =>
      Promise.resolve(),
    );
    const spy = spyOn(component as any, 'modalInstance').and.callFake(() => {
      return {
        afterOk: of({
          ...values,
        }),
      };
    });
    component.applyFile();
    expect(spy).toHaveBeenCalled();
  });

  it('should apply file txt modal instance and columns not equal', () => {
    const values = {
      printColumns: ['id'],
      printPageType: 'all',
      printType: 'portrait',
    };
    component.fileType = 'txt';
    (component as any)._columnPrintingPreference = [
      {
        id: 1,
        key: 'test',
        column: 'name',
      },
    ];
    spyOn(component, 'refExportFrom').and.callFake(async () =>
      Promise.resolve(),
    );
    const spy = spyOn(component as any, 'modalInstance').and.callFake(() => {
      return {
        afterOk: of({
          ...values,
        }),
      };
    });
    component.applyFile();
    expect(spy).toHaveBeenCalled();
  });

  it('should be error apply file not exists', () => {
    component.fileType = 'png' as any;
    try {
      component.applyFile();
    } catch (error: any) {
      expect(error.message).toBe("Can't export unknown data type png.");
    }
  });

  it('should be fileType undefined', () => {
    component.fileType = undefined as any;

    component.applyFile();
    expect(component.fileType).toBeUndefined();
  });

  it('should translate rows', () => {
    component.columns = [
      { prop: 'name', translate: true, visibleColumn: true },
      { prop: 'age', situation: true, visibleColumn: true },
    ];
    component.rows = [
      { name: 'John Doe', age: 25, active: true },
      { name: 'Jane Smith', age: 30, active: false },
    ];

    const translatedRows = component.translateRows();
    expect(translatedRows).toEqual([
      {
        name: 'John Doe',
        age: 'COMMONS.ACTIVE',
        active: true,
      },
      {
        name: 'Jane Smith',
        age: 'COMMONS.ACTIVE',
        active: false,
      },
    ]);
  });

  describe(' applyCurrency', () => {
    const columns = [
      {
        prop: 'age',
        label: 'age',
        summaryCurrency: true,
      },
      {
        prop: 'currency',
        currency: 'BRL',
      },
      {
        prop: 'money',
        currency: 'USD',
      },
      {
        prop: 'discount',
        currency: () => 'EUR',
      },
      {
        prop: 'currencyNotNumber',
        currency: 'BRL',
      },
      {
        prop: 'currencyNotIso',
        currency: 'TEST',
      },
      {
        prop: 'currencySignal',
        currency: 'JPY',
      },
    ];

    it('should apply currency correctly', () => {
      const result = component.applyCurrency(columns as any);
      expect(result).toEqual([
        { column: 'currency', currency: 'BRL' },
        { column: 'money', currency: 'USD' },
        { column: 'discount', currency: 'EUR' },
        { column: 'currencyNotNumber', currency: 'BRL' },
        { column: 'currencyNotIso', currency: 'TEST' },
        { column: 'currencySignal', currency: 'JPY' },
      ]);
    });

    it('should handle columns without currency', () => {
      const columnsWithoutCurrency = [
        { prop: 'age', label: 'age' },
        { prop: 'name', label: 'name' },
      ];
      const result = component.applyCurrency(columnsWithoutCurrency as any);
      expect(result).toEqual([]);
    });

    it('should handle columns with currency as function and label', () => {
      const columnsWithFunctionCurrency = [
        { label: 'discount', currency: () => 'EUR' },
      ];
      const result = component.applyCurrency(
        columnsWithFunctionCurrency as any,
      );
      expect(result).toEqual([{ column: 'discount', currency: 'EUR' }]);
    });

    it('should handle columns with currency as function and name', () => {
      const columnsWithFunctionCurrency = [
        { name: 'discount', currency: () => 'EUR' },
      ];
      const result = component.applyCurrency(
        columnsWithFunctionCurrency as any,
      );
      expect(result).toEqual([{ column: 'discount', currency: 'EUR' }]);
    });

    it('should handle columns with currency as string', () => {
      const columnsWithStringCurrency = [{ prop: 'currency', currency: 'BRL' }];
      const result = component.applyCurrency(columnsWithStringCurrency as any);
      expect(result).toEqual([{ column: 'currency', currency: 'BRL' }]);
    });
  });

  afterEach(() => {
    fixture.destroy();
  });
});
