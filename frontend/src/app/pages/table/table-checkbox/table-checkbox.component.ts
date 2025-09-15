import { Component, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '@vrsoftbr/vr-table';
import { IDtEvents } from '../shared/interfaces/dt-events.interface';
import { Contact } from '../shared/model/contact';
import { CorporateEmployee } from '../shared/model/corporate-employee';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

@Component({
  selector: 'vr-table-checkbox',
  templateUrl: './table-checkbox.component.html',
  styleUrls: ['./table-checkbox.component.scss'],
  providers: [MockServerResultsService],
})
export class TableCheckboxComponent implements OnInit {
  rows = new Array<Contact>();

  ColumnMode = ColumnMode;

  selected: unknown[] = [];

  SelectionType = SelectionType;

  constructor(private serverResultsService: MockServerResultsService) {}

  ngOnInit(): void {
    this.serverResultsService.getResultsJson(20).subscribe((data) => {
      this.rows = data;
    });
  }

  resetSelecteds(): void {
    if (this.selected.length > 0) {
      this.selected = [];
    }
  }

  onSelect({ selected }: { selected: unknown[] }): void {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(_: IDtEvents<CorporateEmployee>): void {
    /** empty */
  }

  displayCheck(row: { name: string }): boolean {
    return row.name !== 'Ethel Price';
  }
}
