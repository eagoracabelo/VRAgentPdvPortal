import { Component, ElementRef, OnInit } from '@angular/core';
import { ColumnMode } from '@vrsoftbr/vrc-datatables';
import { Observable, of } from 'rxjs';
import { CorporateEmployee } from '../shared/model/corporate-employee';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-datatable-server-scrolling',
  templateUrl: './datatable-server-scrolling.component.html',
  styleUrls: ['./datatable-server-scrolling.component.scss'],
  providers: [MockServerResultsService],
})
export class DatatableServerScrollingComponent implements OnInit {
  readonly headerHeight = 2.625; // rem
  readonly rowHeight = 2; // rem
  readonly pageLimit = 10;

  rows: CorporateEmployee[] = [];
  isLoading!: boolean;

  ColumnMode = ColumnMode;

  items$: Observable<unknown> = of([
    { value: 'AK', label: 'Alaska' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'CA', label: 'California' },
    { value: 'NV', label: 'Nevada' },
    { value: 'OR', label: 'Oregon' },
    { value: 'WA', label: 'Washington' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'CO', label: 'Colorado' },
    { value: 'ID', label: 'Idaho' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
  ]);

  constructor(
    private serverResultsService: MockServerResultsService,
    private el: ElementRef<HTMLElement>,
  ) {}

  ngOnInit(): void {
    this.onScroll(0);
  }

  onScroll(offsetY: number | undefined): void {
    if (offsetY === undefined) return;
    if (offsetY > 0) offsetY = offsetY * 16;

    const viewHeight =
      this.el.nativeElement.getBoundingClientRect().height -
      this.headerHeight * 16 +
      300;

    if (
      !this.isLoading &&
      offsetY + viewHeight >= this.rows.length * (this.rowHeight * 16)
    ) {
      let limit = this.pageLimit;

      if (this.rows.length === 0) {
        const pageSize = Math.ceil(viewHeight / (this.rowHeight * 16));
        limit = Math.max(pageSize, this.pageLimit);
      }
      this.loadPage(limit);
    }
  }

  private loadPage(limit: number): void {
    this.isLoading = true;

    this.serverResultsService
      .getResultsServerScrolling(this.rows.length, limit)
      .subscribe((results) => {
        const rows = [...this.rows, ...results.data];
        this.rows = rows;
        this.isLoading = false;
      });
  }
}
