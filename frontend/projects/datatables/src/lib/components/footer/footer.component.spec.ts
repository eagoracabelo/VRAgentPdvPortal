import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ISort } from '../../interfaces/sort.interface';
import { TranslatorPipe } from '../../pipes/translator.pipe';
import { PageSizeDirective } from './../../directives/page-size.directive';

import { ETokens } from '../../enums/tokens.enum';
import { addMatchers } from '../../test';
import { DataTablePagerComponent } from './components/pager.component';
import { DataTableFooterComponent } from './footer.component';

let fixture: ComponentFixture<TestFixtureComponent>;
let component: TestFixtureComponent;
let page: Page;

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('DataTableFooterComponent', () => {
  beforeAll(addMatchers);

  beforeEach(waitForAsync(setupTest));

  describe('div.datatable-footer-inner', () => {
    it(`should have a height`, () => {
      component.footerHeight = 123;
      page.detectChangesAndRunQueries();

      expect(page.datatableFooterInner.nativeElement.style.height).toEqual(
        '123rem',
      );
    });

    it('should have `.selected-count` class when ofMessage is set', () => {
      component.ofMessage = 'MESSAGE.OF';
      component.selectedCount = 1;
      page.detectChangesAndRunQueries();

      expect(page.datatableFooterInner.nativeElement).toHaveCssClass(
        'selected-count',
      );
    });

    it('should not have `.selected-count` class if ofMessage is not set', () => {
      component.ofMessage = undefined as any;
      page.detectChangesAndRunQueries();

      expect(page.datatableFooterInner.nativeElement).not.toHaveCssClass(
        'selected-count',
      );
    });
  });

  describe('when there is no template', () => {
    it('should not render a template', () => {
      component.footerTemplate = undefined as any;
      page.detectChangesAndRunQueries();
      expect(page.templateList).toBeNull();
    });
    it('should display the selected count and total if itemsMessage set', () => {
      component.footerTemplate = undefined as any;
      component.itemsMessage = 'MESSAGE.ITEMS';
      component.selectedCount = 7;
      component.rowCount = 10;
      component.ofMessage = 'MESSAGE.OF';
      page.detectChangesAndRunQueries();
      const expected = 'MESSAGE.ITEMS-PER-PAGE:  7 MESSAGE.OF 10 MESSAGE.ITEMS';
      expect(
        page.pageCount.nativeElement.innerText.replace(/(\r\n|\n|\r)/gm, ' '),
      ).toEqual(expected);
    });
    it('should display only the total if itemsMessage is not set', () => {
      component.footerTemplate = undefined as any;
      component.itemsMessage = 'MESSAGE.ITEMS';
      component.rowCount = 100;
      component.ofMessage = undefined as any;
      page.detectChangesAndRunQueries();
      expect(page.pageCount.nativeElement.innerText).not.toBeUndefined();
    });
    it('should render a DataTablePagerComponent', () => {
      component.footerTemplate = undefined as any;
      page.detectChangesAndRunQueries();
      expect(page.datatablePager).not.toBeNull();
    });
    it('should propagate page change events upward from the DataTablePagerComponent', () => {
      component.footerTemplate = undefined as any;
      page.detectChangesAndRunQueries();
      const spy = spyOn(component, 'onPageEvent');
      const pageChangeEvent = { page: 7 };
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      // mimic the act of changing the page through the datatable pager
      datatablePagerComponent.change.emit(pageChangeEvent);
      expect(spy).toHaveBeenCalled();
    });
    it('should bind to DataTablePagerComponent pagerLeftArrowIcon input', () => {
      component.pagerLeftArrowIcon = 'pager-left-arrow-icon';
      page.detectChangesAndRunQueries();
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      expect(datatablePagerComponent.pagerLeftArrowIcon).toBe(
        component.pagerLeftArrowIcon,
      );
    });
    it('should bind to DataTablePagerComponent pagerRightArrowIcon input', () => {
      component.pagerRightArrowIcon = 'pager-right-arrow-icon';
      page.detectChangesAndRunQueries();
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      expect(datatablePagerComponent.pagerRightArrowIcon).toBe(
        component.pagerRightArrowIcon,
      );
    });
    it('should bind to DataTablePagerComponent pagerNextIcon input', () => {
      component.pagerNextIcon = 'pager-next-icon';
      page.detectChangesAndRunQueries();
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      expect(datatablePagerComponent.pagerNextIcon).toBe(
        component.pagerNextIcon,
      );
    });
    it('should bind to DataTablePagerComponent pagerPreviousIcon input', () => {
      component.pagerPreviousIcon = 'pager-previous-icon';
      page.detectChangesAndRunQueries();
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      expect(datatablePagerComponent.pagerPreviousIcon).toBe(
        component.pagerPreviousIcon,
      );
    });
    it('should bind to DataTablePagerComponent size input', () => {
      component.pageSize = 4;
      page.detectChangesAndRunQueries();
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      expect(datatablePagerComponent.size).toBe(component.pageSize);
    });
    it('should bind to DataTablePagerComponent count input', () => {
      component.rowCount = 40;
      page.detectChangesAndRunQueries();
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      expect(datatablePagerComponent.count).toBe(component.rowCount);
    });
    it('should bind to DataTablePagerComponent page input', () => {
      component.offset = 200;
      page.detectChangesAndRunQueries();
      const datatablePagerComponent: DataTablePagerComponent =
        page.datatablePager.componentInstance;
      expect(datatablePagerComponent.page).toBe(201);
    });
    it('should show & hide the DataTablePagerComponent', () => {
      component.rowCount = 200;
      component.pageSize = 5;
      page.detectChangesAndRunQueries();
      expect(page.datatablePager.nativeElement.hidden).toBe(
        false,
        'DataTablePagerComponent should be hidden',
      );
      component.rowCount = 1;
      component.pageSize = 2;
      page.detectChangesAndRunQueries();
      expect(page.datatablePager.nativeElement.hidden).toBe(
        true,
        'DataTablePagerComponent should not be hidden',
      );
    });
  });

  describe('when there is a template', () => {
    it('should not render div.page-count or DatatablePagerComponent', () => {
      component.footerTemplate = { template: component.testTemplate };
      page.detectChangesAndRunQueries();

      expect(page.pageCount).toBeNull();
      expect(page.datatablePager).toBeNull();
    });

    it('should render the template', () => {
      page.detectChangesAndRunQueries();
      component.footerTemplate = { template: component.testTemplate };
      page.detectChangesAndRunQueries();

      expect(page.templateList).not.toBeNull();
    });

    it('should give the template proper context', () => {
      component.footerTemplate = { template: component.testTemplate };
      component.rowCount = 12;
      component.pageSize = 1;
      component.selectedCount = 4;
      component.offset = 0;
      page.detectChangesAndRunQueries();
      const listItems = page.templateList.queryAll(By.css('li'));

      expect(listItems[0].nativeElement).toHaveText('rowCount 12');
      expect(listItems[1].nativeElement).toHaveText('pageSize 1');
      expect(listItems[2].nativeElement).toHaveText('selectedCount 4');
      expect(listItems[3].nativeElement).toHaveText('curPage 1');
      expect(listItems[4].nativeElement).toHaveText('offset 0');
    });
  });
});

/**
 * we test DatatableFooterComponent by embedding it in a
 * test host component
 */
@Component({
  template: `
    <datatable-footer
      [rowCount]="rowCount"
      [pageSize]="pageSize"
      [offset]="offset"
      [footerHeight]="footerHeight"
      [footerTemplate]="footerTemplate"
      [ofMessage]="ofMessage"
      [pagerLeftArrowIcon]="pagerLeftArrowIcon"
      [pagerRightArrowIcon]="pagerRightArrowIcon"
      [pagerPreviousIcon]="pagerPreviousIcon"
      [selectedCount]="selectedCount"
      [itemsMessage]="itemsMessage"
      [itemsPerPageMessage]="itemsPerPageMessage"
      [pagerNextIcon]="pagerNextIcon"
      (page)="onPageEvent($event)"
    >
    </datatable-footer>

    <ng-template
      #testTemplate
      let-rowCount="rowCount"
      let-pageSize="pageSize"
      let-selectedCount="selectedCount"
      let-curPage="curPage"
      let-offset="offset"
    >
      <ul id="template-list">
        <li>rowCount {{ rowCount }}</li>
        <li>pageSize {{ pageSize }}</li>
        <li>selectedCount {{ selectedCount }}</li>
        <li>curPage {{ curPage }}</li>
        <li>offset {{ offset }}</li>
      </ul>
    </ng-template>
  `,
})
class TestFixtureComponent {
  footerHeight!: number;
  rowCount = 100;
  pageSize = 1;
  offset = 0;
  pagerLeftArrowIcon!: string;
  pagerRightArrowIcon!: string;
  pagerPreviousIcon!: string;
  pagerNextIcon!: string;
  ofMessage!: string;
  footerTemplate!: { template: TemplateRef<any> };
  selectedCount!: number;
  itemsMessage!: string;
  itemsPerPageMessage!: string;

  /**
   * establishes a reference to a test template that can
   * selectively be passed to the DatatableFooterComponent
   * in these unit tests
   */
  @ViewChild('testTemplate', { read: TemplateRef, static: true })
  testTemplate!: TemplateRef<any>;

  onPageEvent() {
    return;
  }
}

/**
 * we use a mock DataTablePagerComponent when testing
 * the DataTableFooterComponent
 */
@Component({
  selector: 'datatable-pager',
  template: '',
})
class DataTablePagerComponentMock {
  @Input() pagerLeftArrowIcon!: string;
  @Input() pagerRightArrowIcon!: string;
  @Input() pagerPreviousIcon!: string;
  @Input() pagerNextIcon!: string;
  @Input() page!: number;
  @Input() size!: number;
  @Input() count!: number;
  @Input() sorts!: ISort;

  @Output() change: EventEmitter<any> = new EventEmitter();
}

function setupTest() {
  return TestBed.configureTestingModule({
    declarations: [
      TestFixtureComponent,
      DataTableFooterComponent,
      DataTablePagerComponentMock,
      TranslatorPipe,
      PageSizeDirective,
    ],
    providers: [
      {
        provide: ETokens.TRANSLATOR_TOKEN,
        useClass: TranslatorPipeTest,
      },
    ],
  })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
      component.itemsMessage = 'MESSAGE.ITEMS';
      component.itemsPerPageMessage = 'MESSAGE.ITEMS-PER-PAGE';
      component.ofMessage = 'MESSAGE.OF';
      fixture.detectChanges();
      page = new Page();
      page.detectChangesAndRunQueries();
    });
}

/**
 * a Page is a collection of references to DebugElements. it
 * makes for cleaner testing
 */
class Page {
  datatableFooter!: DebugElement;
  datatableFooterInner!: DebugElement;
  templateList!: DebugElement;
  pageCount!: DebugElement;
  datatablePager!: DebugElement;

  detectChangesAndRunQueries() {
    fixture.detectChanges();

    const de = fixture.debugElement;

    this.datatableFooter = de.query(By.css('datatable-footer'));
    this.datatableFooterInner = de.query(By.css('.datatable-footer-inner'));
    this.templateList = de.query(By.css('#template-list'));
    this.pageCount = de.query(By.css('.page-count'));
    this.datatablePager = de.query(By.css('datatable-pager'));
  }
}
