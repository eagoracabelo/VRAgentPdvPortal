import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { commonsImports } from '../commons-imports';
import { TableCheckboxRoutingModule } from './table-checkbox-routing.module';
import { TableCheckboxComponent } from './table-checkbox.component';

@NgModule({
  declarations: [TableCheckboxComponent],
  imports: [CommonModule, TableCheckboxRoutingModule, ...commonsImports],
})
export class TableCheckboxModule {}
