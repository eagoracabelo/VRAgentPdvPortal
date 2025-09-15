import { Component, OnInit } from '@angular/core';
import { ColumnMode } from '@vrsoftbr/vr-table';
import { Person } from '../shared/model/person';
import { MockServerResultsService } from '../shared/services/mock-server-results.service';

/* eslint-disable */
@Component({
  selector: 'vr-table-object',
  templateUrl: './table-object.component.html',
  styleUrls: ['./table-object.component.scss'],
  providers: [MockServerResultsService],
})
export class TableObjectComponent implements OnInit {
  rows = new Array<Person>();

  ColumnMode = ColumnMode;

  constructor(private serverResultsService: MockServerResultsService) {}

  ngOnInit(): void {
    this.serverResultsService.getResultsObjectJson(20).subscribe((data) => {
      this.rows = data;
    });
  }

  onEdit(row: Person): void {
    console.log('row', row);
  }

  onRemove(row: Person): void {
    console.log('row', row);
  }
}
