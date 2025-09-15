import { Component, Injector, OnDestroy, OnInit } from '@angular/core';

import { IExportData } from '../../../common/export-data';
import { ModalConfig } from '../../config/modal-config';
import { ModalRef } from '../../references/modal-ref';
import { BaseConfigComponent } from '../base/base-config';
import { TableColumn } from './../../../../../types/table-column.type';

@Component({
  selector: 'table-export-config-excel',
  templateUrl: './excel-config.component.html',
  host: {
    class: 'table-export-config',
  },
})
export class ExcelConfigComponent
  extends BaseConfigComponent
  implements OnInit, OnDestroy
{
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
