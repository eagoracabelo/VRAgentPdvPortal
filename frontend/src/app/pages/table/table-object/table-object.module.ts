import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { commonsImports } from '../commons-imports';
import { TableObjectRoutingModule } from './table-object-routing.module';
import { TableObjectComponent } from './table-object.component';

@NgModule({
  declarations: [TableObjectComponent],
  imports: [CommonModule, TableObjectRoutingModule, ...commonsImports],
})
export class TableObjectModule {}
