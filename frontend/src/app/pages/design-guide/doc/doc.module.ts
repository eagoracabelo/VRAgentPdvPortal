import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MarkdownModule } from 'ngx-markdown';
import { DocRoutingModule } from './doc-routing.module';
import { DocComponent } from './doc.component';

@NgModule({
  declarations: [DocComponent],
  imports: [CommonModule, DocRoutingModule, MarkdownModule],
})
export class DocModule {}
