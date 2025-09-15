import { Component, Injector, OnInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IExportData } from '../../../common/export-data';
import { ModalConfig } from '../../config/modal-config';
import { ModalRef } from '../../references/modal-ref';
import { TableColumn } from './../../../../../types/table-column.type';
import { BaseConfigComponent } from './base-config';
@Component({})
class BaseConfig extends BaseConfigComponent implements OnInit {
  constructor(
    protected override config: ModalConfig<TableColumn[]>,
    public override modal: ModalRef<IExportData>,
    protected override readonly injector: Injector,
  ) {
    super(config, modal, injector);
    this.formatData(config);
  }
  override ngOnInit(): void {
    super.ngOnInit();
  }
}
describe('BaseConfigComponent sem config', () => {
  let component: BaseConfig;
  let fixture: ComponentFixture<BaseConfig>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseConfig],
      providers: [ModalRef, { provide: ModalConfig, useValue: { data: {} } }],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });
  it('Shold data in heads', () => {});
});
describe('BaseConfigComponent', () => {
  let component: BaseConfig;
  let fixture: ComponentFixture<BaseConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseConfig],
      providers: [
        ModalRef,
        {
          provide: ModalConfig,
          useValue: { data: [{ id: '1', exportable: true, label: 'teste' }] },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit();
  });

  describe('Basic Config', () => {
    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('isChecked method to be defined', () => {
      const event: any = { target: { checked: true } } as unknown as Event;
      const teste = '';
      const isChecked = component.isChecked(event, teste);
      expect(isChecked).toBe(undefined);
    });

    it('checkedAll method to be defined', () => {
      const event: any = { target: { checked: true } };
      const checkedAll = component.checkedAll(event);
      expect(checkedAll).toBe(undefined);
    });

    it('isCheckBoxChecked method to be defined', () => {
      const isCheckBoxChecked = component.isCheckBoxChecked('id');
      expect(isCheckBoxChecked).toBeFalse();
    });

    it('setTypePrint method to be defined', () => {
      const event: any = { target: { checked: true } };
      const setTypePrint = component.setTypePrint(event);
      expect(setTypePrint).toBe(undefined);
    });

    it('applyPrint method to be defined', () => {
      expect(component.applyPrint()).toBe(undefined);
    });

    it('trackByFn method to be defined', () => {
      const event: any = 0;
      const trackByFn = component.trackByFn(event);
      expect(trackByFn).toEqual(0);
    });
  });
});
