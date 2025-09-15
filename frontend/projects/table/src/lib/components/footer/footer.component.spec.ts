import { Component, DebugElement, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';
import { addMatchers } from '../../test';
import { TableFooterComponent } from './footer.component';

let fixture: ComponentFixture<TestFixtureComponent>;
let component: TestFixtureComponent;
let translationService: TranslationService;
let page: Page;

describe('TableFooterComponent', () => {
  beforeAll(addMatchers);

  beforeEach(waitForAsync(setupTest));

  describe('div.table-footer-inner', () => {
    it(`should have a height`, () => {
      component.footerHeight = 123;
      page.detectChangesAndRunQueries();

      expect(page.tableFooterInner.nativeElement.style.height).toEqual(
        '123rem',
      );
    });

    it('should have `.selected-count` class when selectedMessage is set', () => {
      component.selectedMessage = 'MESSAGE.SELECTED';
      component.selectedCount = 1;
      page.detectChangesAndRunQueries();

      expect(page.tableFooterInner.nativeElement).toHaveCssClass(
        'selected-count',
      );
    });

    it('should not have `.selected-count` class if selectedMessage is not set', () => {
      component.selectedMessage = undefined as any;
      page.detectChangesAndRunQueries();

      expect(page.tableFooterInner.nativeElement).not.toHaveCssClass(
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

    xit('should display the selected count and total if selectedMessage set', () => {
      component.footerTemplate = undefined as any;
      component.selectedMessage = 'MESSAGE.SELECTED';
      component.selectedCount = 7;
      component.rowCount = 10;
      component.totalMessage = 'MESSAGE.TOTAL';
      page.detectChangesAndRunQueries();

      expect(page.pageCount.nativeElement.innerText).toEqual(
        '7 selecionado / 10 total',
      );
    });

    xit('should display only the total if selectedMessage is not set', () => {
      component.footerTemplate = undefined as any;
      component.selectedMessage = undefined as any;
      component.rowCount = 100;
      component.totalMessage = 'MESSAGE.TOTAL';
      page.detectChangesAndRunQueries();

      expect(page.pageCount.nativeElement.innerText).toEqual('100 total');
    });
  });

  describe('when there is a template', () => {
    it('should render the template', () => {
      page.detectChangesAndRunQueries();
      component.footerTemplate = { template: component.testTemplate };
      page.detectChangesAndRunQueries();

      expect(page.templateList).not.toBeNull();
    });

    xit('should give the template proper context', () => {
      component.footerTemplate = { template: component.testTemplate };
      component.rowCount = 12;
      component.selectedCount = 4;
      component.offset = 0;
      page.detectChangesAndRunQueries();
      const listItems = page.templateList.queryAll(By.css('li'));

      expect(listItems[0].nativeElement).toHaveText('rowCount 12');
      expect(listItems[2].nativeElement).toHaveText('selectedCount 4');
      expect(listItems[4].nativeElement).toHaveText('offset 0');
    });
  });
});

/**
 * we test TableFooterComponent by embedding it in a
 * test host component
 */
@Component({
  template: `
    <table-footer
      [rowCount]="rowCount"
      [offset]="offset"
      [footerHeight]="footerHeight"
      [footerTemplate]="footerTemplate"
      [totalMessage]="totalMessage"
      [selectedCount]="selectedCount"
      [selectedMessage]="selectedMessage"
      (page)="onPageEvent($event)"
    >
    </table-footer>

    <ng-template
      #testTemplate
      let-rowCount="rowCount"
      let-selectedCount="selectedCount"
      let-offset="offset"
    >
      <ul id="template-list">
        <li>rowCount {{ rowCount }}</li>
        <li>selectedCount {{ selectedCount }}</li>
        <li>offset {{ offset }}</li>
      </ul>
    </ng-template>
  `,
})
class TestFixtureComponent {
  footerHeight!: number;
  rowCount = 100;
  offset = 0;
  totalMessage!: string;
  footerTemplate!: { template: TemplateRef<any> };
  selectedCount!: number;
  selectedMessage!: string;

  /**
   * establishes a reference to a test template that can
   * selectively be passed to the TableFooterComponent
   * in these unit tests
   */
  @ViewChild('testTemplate', { read: TemplateRef, static: true })
  testTemplate!: TemplateRef<any>;

  onPageEvent() {
    return;
  }
}

function setupTest() {
  return TestBed.configureTestingModule({
    declarations: [TestFixtureComponent, TableFooterComponent, TranslatePipe],
    providers: [TranslationService],
  })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
      translationService = TestBed.inject(TranslationService);
      component.selectedMessage = 'MESSAGE.SELECTED';
      component.totalMessage = 'MESSAGE.TOTAL';
      translationService.loadTranslation('pt-BR').subscribe();
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
  tableFooter!: DebugElement;
  tableFooterInner!: DebugElement;
  templateList!: DebugElement;
  pageCount!: DebugElement;
  tablePager!: DebugElement;

  detectChangesAndRunQueries() {
    fixture.detectChanges();

    const de = fixture.debugElement;

    this.tableFooter = de.query(By.css('table-footer'));
    this.tableFooterInner = de.query(By.css('.table-footer-inner'));
    this.templateList = de.query(By.css('#template-list'));
    this.pageCount = de.query(By.css('.page-count'));
    this.tablePager = de.query(By.css('table-pager'));
  }
}
