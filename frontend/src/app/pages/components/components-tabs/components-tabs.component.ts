import { Component } from '@angular/core';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

export interface Exemplo {
  title: string;
  borderPosition: 'top' | 'bottom' | 'left';
  linePosition: 'top' | 'bottom' | 'both' | 'none';
  style: 'hover' | 'link';
  subTab?: boolean;
}

@Component({
  selector: 'vr-components-tabs',
  templateUrl: './components-tabs.component.html',
  styleUrls: ['./components-tabs.component.scss'],
})
export class ComponentsTabsComponent extends MarkdownCommon {
  exemplos: Exemplo[] = [
    {
      title: '1. default options and disabled',
      borderPosition: 'bottom',
      linePosition: 'bottom',
      style: 'hover',
    },
    {
      title: '2. options',
      borderPosition: 'top',
      linePosition: 'bottom',
      style: 'hover',
    },
    {
      title: '3. options',
      borderPosition: 'bottom',
      linePosition: 'top',
      style: 'hover',
    },
    {
      title: '4. options',
      borderPosition: 'top',
      linePosition: 'top',
      style: 'hover',
    },
    {
      title: '5. options',
      borderPosition: 'bottom',
      linePosition: 'both',
      style: 'hover',
    },
    {
      title: '6. options',
      borderPosition: 'top',
      linePosition: 'both',
      style: 'hover',
    },
    {
      title: '7. options',
      borderPosition: 'left',
      linePosition: 'none',
      style: 'link',
      subTab: true,
    },
  ];

  onTabChange(selectedIndex: number): void {
    console.log(selectedIndex);
  }
}
