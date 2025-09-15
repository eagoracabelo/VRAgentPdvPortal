import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import posthog from 'posthog-js';
import { Subscription } from 'rxjs';
import { ETokens } from '../../../../../enums/tokens.enum';
import { TranslatorPipe } from '../../../../../pipes/translator.pipe';
import { ModalConfig } from '../../config/modal-config';
import { IModalFileConfig } from '../../interfaces/modal-file-config.interface';
import { ModalRef } from '../../references/modal-ref';
import { FileConfigComponent } from './file-config.component';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('FileConfigComponent', () => {
  let component: FileConfigComponent;
  let fixture: ComponentFixture<FileConfigComponent>;

  const mockModalConfig: ModalConfig<IModalFileConfig> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileConfigComponent, TranslatorPipe],
      providers: [
        { provide: ModalConfig, useValue: mockModalConfig },
        ChangeDetectorRef,
        ModalRef,
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should format data correctly', () => {
    const modalConfig: ModalConfig<IModalFileConfig> = {
      data: {
        disableExportAll: true,
        exportType: 'pdf',
        columns: [
          { label: 'Column 1', name: 'column1', visibleColumn: true },
          { label: 'Column 2', name: 'column2', visibleColumn: true },
        ],
        columnPrintingPreference: [
          { key: 'test', column: 'Column 1' },
          { key: 'test', column: 'Column 2' },
        ],
        onlyLandscapeView: false,
      },
    };
    component['formatData'](modalConfig);
    expect(component.disableExportAll).toEqual(true);
    expect(component.exportType).toEqual('pdf');
    expect(component.heads).toEqual(['Column 1', 'Column 2']);
  });

  it('should format data correctly if not label', () => {
    const modalConfig: ModalConfig<IModalFileConfig> = {
      data: {
        disableExportAll: true,
        exportType: 'pdf',
        columns: [
          { label: undefined, name: 'column1', visibleColumn: true },
          { label: undefined, name: 'column2', visibleColumn: true },
        ],
        columnPrintingPreference: [
          { key: 'test', column: 'Column 1' },
          { key: 'test', column: 'Column 2' },
        ],
        onlyLandscapeView: false,
      },
    };
    component['formatData'](modalConfig);
    expect(component.disableExportAll).toEqual(true);
    expect(component.exportType).toEqual('pdf');
    expect(component.heads).toEqual(['column1', 'column2']);
  });

  it('should check column printing preference correctly', () => {
    component.selectedColumn = [];
    const modalConfig: ModalConfig<IModalFileConfig> = {
      data: {
        disableExportAll: true,
        exportType: 'pdf',
        columns: [
          { label: 'Column 1', name: 'column1', visibleColumn: true },
          { label: 'Column 2', name: 'column2', visibleColumn: true },
          { label: 'Column X', name: 'columnx', visibleColumn: true },
        ],
        columnPrintingPreference: [
          { key: 'test', column: 'Column 1' },
          { key: 'test', column: 'Column 2' },
        ],
        preSelectedColumns: ['Column X'],
        onlyLandscapeView: false,
      },
    };
    mockModalConfig.data = modalConfig.data;
    component.heads = ['Column 1', 'Column 2'];
    component['formatData'](mockModalConfig);
    expect(component.selectedColumn).toEqual([
      'Column 1',
      'Column 2',
      'Column X',
    ]);
  });

  it('should add value to selectedColumn when isChecked is called with a checked checkbox', () => {
    const event = { target: { checked: true } } as unknown as Event;
    component.selectedColumn = [];
    component.isChecked(event, 'Column 1');
    expect(component.selectedColumn).toEqual(['Column 1']);
  });

  it('should remove value from selectedColumn when isChecked is called with an unchecked checkbox', () => {
    const event = { target: { checked: false } } as unknown as Event;
    component.selectedColumn = ['Column 1', 'Column 2'];
    component.isChecked(event, 'Column 1');
    expect(component.selectedColumn).toEqual(['Column 2']);
  });

  it('should add all heads to selectedColumn when checkedAll is called with a checked checkbox', () => {
    const event = { target: { checked: true } } as unknown as Event;
    component.heads = ['Column 1', 'Column 2', 'Column 3'];
    component.selectedColumn = [];
    component.checkedAll(event);
    expect(component.selectedColumn).toEqual([
      'Column 1',
      'Column 2',
      'Column 3',
    ]);
  });

  it('should clear selectedColumn when checkedAll is called with an unchecked checkbox', () => {
    const event = { target: { checked: false } } as unknown as Event;
    component.heads = ['Column 1', 'Column 2', 'Column 3'];
    component.selectedColumn = ['Column 1', 'Column 2', 'Column 3'];
    component.checkedAll(event);
    expect(component.selectedColumn).toEqual([]);
  });

  it('should return true when isCheckBoxChecked is called with a value that exists in selectedColumn', () => {
    component.selectedColumn = ['Column 1', 'Column 2'];
    expect(component.isCheckBoxChecked('Column 1')).toBe(true);
  });

  it('should return false when isCheckBoxChecked is called with a value that does not exist in selectedColumn', () => {
    component.selectedColumn = ['Column 1', 'Column 2'];
    expect(component.isCheckBoxChecked('Column 3')).toBe(false);
  });

  it('should return true when isAllCheckBoxChecked is called and selectedColumn length is equal to heads length', () => {
    component.heads = ['Column 1', 'Column 2', 'Column 3'];
    component.selectedColumn = ['Column 1', 'Column 2', 'Column 3'];
    expect(component.isAllCheckBoxChecked()).toBe(true);
  });

  it('should return false when isAllCheckBoxChecked is called and selectedColumn length is not equal to heads length', () => {
    component.heads = ['Column 1', 'Column 2', 'Column 3'];
    component.selectedColumn = ['Column 1', 'Column 2'];
    expect(component.isAllCheckBoxChecked()).toBe(false);
  });

  it('should return true when isCheckedPrinType is called with a value that is equal to selectedPrintType', () => {
    component.selectedPrintType = 'portrait';
    expect(component.isCheckedPrinType('portrait')).toBe(true);
  });

  it('should return false when isCheckedPrinType is called with a value that is not equal to selectedPrintType', () => {
    component.selectedPrintType = 'portrait';
    expect(component.isCheckedPrinType('landscape')).toBe(false);
  });

  it('should set selectedPrintType correctly when setTypePrint is called', () => {
    component.selectedPrintType = 'portrait';
    component.setTypePrint('landscape');
    expect(component.selectedPrintType).toEqual('landscape');
  });

  it('should return true when isCheckedPrinPageType is called with a value that is equal to selectedPrintPageType', () => {
    component.selectedPrintPageType = 'current';
    expect(component.isCheckedPrinPageType('current')).toBe(true);
  });

  it('should return false when isCheckedPrinPageType is called with a value that is not equal to selectedPrintPageType', () => {
    component.selectedPrintPageType = 'current';
    expect(component.isCheckedPrinPageType('all')).toBe(false);
  });

  it('should set selectedPrintPageType correctly when setTypePrintPage is called', () => {
    component.selectedPrintPageType = 'current';
    component.setTypePrintPage('all');
    expect(component.selectedPrintPageType).toEqual('all');
  });

  it('should not call modal.ok when applyPrint is called and selectedColumn length is 0', () => {
    spyOn(component.modal, 'ok');
    component.selectedColumn = [];
    component.applyPrint();
    expect(component.modal.ok).not.toHaveBeenCalled();
  });

  it('should call modal.ok with the correct data when applyPrint is called and selectedColumn length is greater than 0', () => {
    spyOn(component.modal, 'ok');
    component.selectedColumn = ['Column 1', 'Column 2'];
    component.applyPrint();
    expect(component.modal.ok).toHaveBeenCalled();
  });

  it('should call modal.ok with the correct data when applyPrint is called and using a event tracking', () => {
    const spyPostHog = spyOn(posthog, 'capture');

    spyOn(component.modal, 'ok');

    component.selectedColumn = ['Column 1', 'Column 2'];
    component.eventTrackingIdentifier = 'test';

    component.applyPrint();

    expect(component.modal.ok).toHaveBeenCalled();

    expect(spyPostHog).toHaveBeenCalled();
  });

  it('should return the index when trackByFn is called', () => {
    const index = component.trackByFn(1, 'item');
    expect(index).toEqual(1);
  });

  it('should unsubscribe from all subscriptions when ngOnDestroy is called', () => {
    const subscription1 = new Subscription();
    const subscription2 = new Subscription();
    component['_subs'].push(subscription1, subscription2);
    spyOn(subscription1, 'unsubscribe');
    spyOn(subscription2, 'unsubscribe');
    component.ngOnDestroy();
    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
  });

  it('should check pre selected columns correctly', () => {
    const modalConfig: ModalConfig<IModalFileConfig> = {
      data: {
        disableExportAll: true,
        exportType: 'pdf',
        columns: [
          { label: 'Column 1', name: 'column1', visibleColumn: true },
          { label: 'Column 2', name: 'column2', visibleColumn: true },
          { label: 'Column 3', name: 'column3', visibleColumn: true },
          { label: 'Column 4', name: 'column4', visibleColumn: true },
        ],
        columnPrintingPreference: [],
        preSelectedColumns: ['Column 1'],
        onlyLandscapeView: false,
      },
    };
    mockModalConfig.data = modalConfig.data;
    component['formatData'](mockModalConfig);
    expect(component.selectedColumn).toEqual(['Column 1']);
  });

  it('should set onlyLandscapeView as true if provided', () => {
    const modalConfig: ModalConfig<IModalFileConfig> = {
      data: {
        disableExportAll: true,
        exportType: 'pdf',
        columns: [
          { label: 'Column 1', name: 'column1', visibleColumn: true },
          { label: 'Column 2', name: 'column2', visibleColumn: true },
        ],
        columnPrintingPreference: [],
        onlyLandscapeView: true,
      },
    };
    mockModalConfig.data = modalConfig.data;
    component['formatData'](mockModalConfig);
    expect(component.onlyLandscapeView).toEqual(true);
  });
});
