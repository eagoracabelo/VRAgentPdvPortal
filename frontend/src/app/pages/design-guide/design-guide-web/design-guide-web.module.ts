import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeMirrorModule } from '../../../shared/code-mirror/code-mirror.module';
import { DesignGuideButtonsComponent } from './design-guide-buttons/design-guide-buttons.component';
import { DesignGuideCardComponent } from './design-guide-card/design-guide-card.component';
import { DesignGuideCodeComponent } from './design-guide-code/design-guide-code.component';
import { DesignGuideFormsComponent } from './design-guide-forms/design-guide-forms.component';
import { DesignGuideGridComponent } from './design-guide-grid/design-guide-grid.component';
import { DesignGuideListsComponent } from './design-guide-lists/design-guide-lists.component';
import { DesignGuidePaginationComponent } from './design-guide-pagination/design-guide-pagination.component';
import { DesignGuideQueriesComponent } from './design-guide-queries/design-guide-queries.component';
import { DesignGuideSpacingComponent } from './design-guide-spacing/design-guide-spacing.component';
import { DesignGuideTablesComponent } from './design-guide-tables/design-guide-tables.component';
import { DesignGuideTooltipsComponent } from './design-guide-tooltips/design-guide-tooltips.component';
import { DesignGuideTypographyComponent } from './design-guide-typography/design-guide-typography.component';
import { DesignGuideUtilitiesComponent } from './design-guide-utilities/design-guide-utilities.component';
import { WebRoutingModule } from './design-guide-web-routing.module';

@NgModule({
  declarations: [
    DesignGuideGridComponent,
    DesignGuideSpacingComponent,
    DesignGuideCardComponent,
    DesignGuideTypographyComponent,
    DesignGuideButtonsComponent,
    DesignGuideFormsComponent,
    DesignGuideTooltipsComponent,
    DesignGuideTablesComponent,
    DesignGuidePaginationComponent,
    DesignGuideListsComponent,
    DesignGuideCodeComponent,
    DesignGuideQueriesComponent,
    DesignGuideUtilitiesComponent,
  ],
  imports: [CommonModule, WebRoutingModule, FormsModule, CodeMirrorModule],
})
export class DesignGuideWebModule {}
