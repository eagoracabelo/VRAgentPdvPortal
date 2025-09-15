import {
  CommonModule,
  CurrencyPipe,
  registerLocaleData,
} from '@angular/common';
import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VrcIconModule } from '@vrsoftbr/vr-components';
import { IMaskModule } from 'angular-imask';

import localePt from '@angular/common/locales/pt';
import { TranslatorPipeImpl } from './classes/translator-pipe';
import { DataTableBodyComponent } from './components/body/body.component';
import { DataTableBodyCellComponent } from './components/body/components/body-cell/body-cell.component';
import { DataTableRowWrapperComponent } from './components/body/components/body-row-wrapper/body-row-wrapper.component';
import { DataTableBodyRowComponent } from './components/body/components/body-row/body-row.component';
import { ProgressBarComponent } from './components/body/components/progress-bar/progress-bar.component';
import { ScrollerComponent } from './components/body/components/scroller/scroller.component';
import { DataTableSelectionComponent } from './components/body/components/selection/selection.component';
import { DataTableSummaryRowComponent } from './components/body/components/summary/summary-row.component';
import { DatatableGroupHeaderTemplateDirective } from './components/body/directives/body-group-header-template.directive';
import { DatatableGroupHeaderDirective } from './components/body/directives/body-group-header.directive';
import { DataTableColumnCellDirective } from './components/columns/column-cell.directive';
import { DataTableColumnHeaderDirective } from './components/columns/column-header.directive';
import { DataTableColumnDirective } from './components/columns/column.directive';
import { DataTableColumnCellTreeToggle } from './components/columns/tree.directive';
import { DatatableComponent } from './components/datatable.component';
import { DataTablePagerComponent } from './components/footer/components/pager.component';
import { DataTableFooterTemplateDirective } from './components/footer/directives/footer-template.directive';
import { DatatableFooterDirective } from './components/footer/directives/footer.directive';
import { DataTableFooterComponent } from './components/footer/footer.component';
import { DataTableHeaderCellComponent } from './components/header/components/header-cell/header-cell.component';
import { DataTableHeaderComponent } from './components/header/header.component';
import { DatatableRowAddTemplateDirective } from './components/row-add/row-add-template.directive';
import { DatatableRowAddDirective } from './components/row-add/row-add.directive';
import { DatatableRowDetailTemplateDirective } from './components/row-detail/row-detail-template.directive';
import { DatatableRowDetailDirective } from './components/row-detail/row-detail.directive';
import { ExportFileComponent } from './components/tools/actions/export-file/export-file.component';
import { FireEventSelectedComponent } from './components/tools/actions/fire-event-selected/fire-event-selected.component';
import { MoveColumnComponent } from './components/tools/actions/move-column/move-column.component';
import { MoveSelectedEventComponent } from './components/tools/actions/move-selected-event/move-selected-event.component';
import { PageSizeComponent } from './components/tools/actions/page-size/page-size.component';
import { ToggleColumnComponent } from './components/tools/actions/toggle-column/toggle-column.component';
import { FileConfigComponent } from './components/tools/modal/components/file-config/file-config.component';
import { ToggleColumnConfigComponent } from './components/tools/modal/components/toggle-column-config/toggle-column-config.component';
import { ModalDirective } from './components/tools/modal/directives/modal.directive';
import { ModalComponent } from './components/tools/modal/modal.component';
import { DataTableToolsComponent } from './components/tools/tools.component';
import { DraggableDirective } from './directives/draggable.directive';
import { LongPressDirective } from './directives/long-press.directive';
import { OrderableDirective } from './directives/orderable.directive';
import { PageSizeDirective } from './directives/page-size.directive';
import { ResizeableDirective } from './directives/resizeable.directive';
import { VisibilityDirective } from './directives/visibility.directive';
import { TranslatorPipe } from './pipes/translator.pipe';
import { ColumnChangesService } from './services/column-changes.service';
import { DimensionsHelper } from './services/dimensions-helper.service';
import { EditColumnService } from './services/edit-column.service';
import { ScrollbarHelper } from './services/scrollbar-helper.service';
import { TablePageScreen } from './services/table-page-screen.service';

registerLocaleData(localePt);

export function createTranslatorFactory(
  provider: TranslatorPipeImpl,
): TranslatorPipeImpl {
  return provider;
}
@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IMaskModule, VrcIconModule],
  providers: [
    ScrollbarHelper,
    DimensionsHelper,
    TablePageScreen,
    ColumnChangesService,
    EditColumnService,
    CurrencyPipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  declarations: [
    DataTableFooterTemplateDirective,
    VisibilityDirective,
    DraggableDirective,
    ResizeableDirective,
    OrderableDirective,
    LongPressDirective,
    ScrollerComponent,
    DatatableComponent,
    DataTableColumnDirective,
    DataTableHeaderComponent,
    DataTableHeaderCellComponent,
    DataTableBodyComponent,
    DataTableFooterComponent,
    DataTablePagerComponent,
    ProgressBarComponent,
    DataTableBodyRowComponent,
    DataTableRowWrapperComponent,
    DatatableRowDetailDirective,
    DatatableGroupHeaderDirective,
    DatatableRowDetailTemplateDirective,
    DataTableBodyCellComponent,
    DataTableSelectionComponent,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
    DataTableColumnCellTreeToggle,
    DatatableFooterDirective,
    DatatableGroupHeaderTemplateDirective,
    DataTableSummaryRowComponent,
    DataTableToolsComponent,
    FileConfigComponent,
    ModalComponent,
    ModalDirective,
    MoveColumnComponent,
    PageSizeComponent,
    ExportFileComponent,
    FireEventSelectedComponent,
    TranslatorPipe,
    ToggleColumnComponent,
    ToggleColumnConfigComponent,
    PageSizeDirective,
    MoveSelectedEventComponent,
    DatatableRowAddDirective,
    DatatableRowAddTemplateDirective,
  ],
  exports: [
    DatatableComponent,
    DatatableRowDetailDirective,
    DatatableGroupHeaderDirective,
    DatatableRowDetailTemplateDirective,
    DataTableColumnDirective,
    DataTableColumnHeaderDirective,
    DataTableColumnCellDirective,
    DataTableColumnCellTreeToggle,
    DataTableFooterTemplateDirective,
    DatatableFooterDirective,
    DataTablePagerComponent,
    DatatableGroupHeaderTemplateDirective,
    DatatableRowAddDirective,
    DatatableRowAddTemplateDirective,
  ],
})
export class VrcDatatablesModule {
  /**
   * Configure global configuration via IVrcDatatableConfig
   * @param configuration
   */
  static forRoot(
    configuration?: IVrcDatatableConfig,
  ): ModuleWithProviders<VrcDatatablesModule> {
    return {
      ngModule: VrcDatatablesModule,
      providers: [
        {
          provide: 'configuration',
          useValue: configuration,
        },
      ],
    };
  }
}

/**
 * Interface definition for IVrcDatatableConfig global configuration
 */
export interface IVrcDatatableConfig {
  messages: {
    emptyMessage: string; // Message to show when array is presented, but contains no values
    ofMessage: string; // Footer of message
    itemsMessage: string; // Footer items message
    itemsPerPageMessage: string; // Footer items per page message
  };
}
