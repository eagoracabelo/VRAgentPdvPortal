import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { IMaskModule } from 'angular-imask';

import { ExportFileComponent } from './components/tools/actions/export-file/export-file.component';
import { ExcelConfigComponent } from './components/tools/modal/components/excel-config/excel-config.component';
import { PdfConfigComponent } from './components/tools/modal/components/pdf-config/pdf-config.component';
import { TxtConfigComponent } from './components/tools/modal/components/txt-config/txt-config.component';
import { ModalDirective } from './components/tools/modal/directives/modal.directive';
import { ModalComponent } from './components/tools/modal/modal.component';
import { TableBodyComponent } from './components/body/body.component';
import { TableBodyCellComponent } from './components/body/components/body-cell/body-cell.component';
import { TableRowWrapperComponent } from './components/body/components/body-row-wrapper/body-row-wrapper.component';
import { TableBodyRowComponent } from './components/body/components/body-row/body-row.component';
import { ProgressBarComponent } from './components/body/components/progress-bar/progress-bar.component';
import { ScrollerComponent } from './components/body/components/scroller/scroller.component';
import { TableSelectionComponent } from './components/body/components/selection/selection.component';
import { TableSummaryRowComponent } from './components/body/components/summary/summary-row.component';
import { TableGroupHeaderTemplateDirective } from './components/body/directives/body-group-header-template.directive';
import { TableGroupHeaderDirective } from './components/body/directives/body-group-header.directive';
import { TableColumnCellDirective } from './components/columns/column-cell.directive';
import { TableColumnHeaderDirective } from './components/columns/column-header.directive';
import { TableColumnDirective } from './components/columns/column.directive';
import { TableFooterTemplateDirective } from './components/footer/directives/footer-template.directive';
import { TableFooterDirective } from './components/footer/directives/footer.directive';
import { TableFooterComponent } from './components/footer/footer.component';
import { TableHeaderCellComponent } from './components/header/components/header-cell/header-cell.component';
import { TableHeaderComponent } from './components/header/header.component';
import { TableRowDetailTemplateDirective } from './components/row-detail/row-detail-template.directive';
import { TableRowDetailDirective } from './components/row-detail/row-detail.directive';
import { TableComponent } from './components/table.component';
import { TableToolsComponent } from './components/tools/tools.component';
import { OrderableDirective } from './directives/orderable.directive';
import { ResizeableDirective } from './directives/resizeable.directive';
import { VisibilityDirective } from './directives/visibility.directive';
import { TranslatePipe } from './pipes/translate.pipe';
import { ColumnChangesService } from './services/column-changes.service';
import { DimensionsHelper } from './services/dimensions-helper.service';
import { ScrollbarHelper } from './services/scrollbar-helper.service';
import { TranslationService } from './services/translation.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule, IMaskModule],
  providers: [
    TranslationService,
    ScrollbarHelper,
    DimensionsHelper,
    ColumnChangesService,
    HttpClient,
  ],
  declarations: [
    TableFooterTemplateDirective,
    VisibilityDirective,
    ResizeableDirective,
    OrderableDirective,
    ScrollerComponent,
    TableComponent,
    TableColumnDirective,
    TableHeaderComponent,
    TableHeaderCellComponent,
    TableBodyComponent,
    TableFooterComponent,
    ProgressBarComponent,
    TableBodyRowComponent,
    TableRowWrapperComponent,
    TableRowDetailDirective,
    TableGroupHeaderDirective,
    TableRowDetailTemplateDirective,
    TableBodyCellComponent,
    TableSelectionComponent,
    TableColumnHeaderDirective,
    TableColumnCellDirective,
    TableFooterDirective,
    TableGroupHeaderTemplateDirective,
    TableSummaryRowComponent,
    TranslatePipe,
    ExportFileComponent,
    ExcelConfigComponent,
    PdfConfigComponent,
    TxtConfigComponent,
    ModalDirective,
    ModalComponent,
    TableToolsComponent,
  ],
  exports: [
    TableComponent,
    TableRowDetailDirective,
    TableGroupHeaderDirective,
    TableRowDetailTemplateDirective,
    TableColumnDirective,
    TableColumnHeaderDirective,
    TableColumnCellDirective,
    TableFooterTemplateDirective,
    TableFooterDirective,
    TableGroupHeaderTemplateDirective,
  ],
})
export class VrcTableModule {
  /**
   * Configure global configuration via IVrcTableConfig
   * @param configuration
   */
  static forRoot(
    configuration: IVrcTableConfig,
  ): ModuleWithProviders<VrcTableModule> {
    return {
      ngModule: VrcTableModule,
      providers: [{ provide: 'configuration', useValue: configuration }],
    };
  }
}

/**
 * Interface definition for IVrcTableConfig global configuration
 */
export interface IVrcTableConfig {
  messages: {
    emptyMessage: string; // Message to show when array is presented, but contains no values
    totalMessage: string; // Footer total message
    selectedMessage: string; // Footer selected message
  };
}
