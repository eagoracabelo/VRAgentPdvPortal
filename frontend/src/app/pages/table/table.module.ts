import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableRoutingModule } from './table-routing.module';
import { TableComponent } from './table.component';

@NgModule({
  declarations: [TableComponent],
  imports: [CommonModule, TableRoutingModule],
})
export class TableModule {}
