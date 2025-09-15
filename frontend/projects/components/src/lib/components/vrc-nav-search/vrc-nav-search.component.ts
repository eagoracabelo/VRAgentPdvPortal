import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  Subject,
  Subscription,
} from 'rxjs';
import { ETokens } from '../../shared';
import { TranslatorPipeImpl } from '../../shared/classes/translator-pipe';
import { ISearchForm } from './interfaces/search-form.interface';
import { ISearch } from './interfaces/search.interface';

@Component({
  selector: 'vrc-nav-search',
  templateUrl: './vrc-nav-search.component.html',
  styleUrls: ['./vrc-nav-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcNavSearchComponent implements OnDestroy {
  @HostBinding('class') classes = 'search__container';

  @HostListener('window:keydown.enter', ['$event.target'])
  async handleKeyDownEnter(): Promise<void> {
    await this.redirectPage();
  }

  @HostListener('click', ['$event.target'])
  async onClick(el: HTMLElement): Promise<void> {
    const router = this.getField('search');

    if (el.className === 'label-page') await this.redirectPage();

    if (
      el.className === 'vr vr-link_externo' ||
      el.className === 'label-new-page'
    )
      this.openInNewPage(router.value);
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): void {
    event.preventDefault();
    const el = event.target as unknown as { ariaValueText: string };

    if (el.ariaValueText) this.openInNewPage(el.ariaValueText);
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: { target: EventTarget; button: number }): void {
    const el = event.target as unknown as {
      ariaValueText: string;
      className: string;
    };

    if (event.button === 1 && el.ariaValueText)
      this.openInNewPage(el.ariaValueText);
  }

  private _listRoute!: ISearch[];

  @Input() set listRoute(value: ISearch[]) {
    this._listRoute = this.translationFormularioPesquisa(value);
    this.filterFormularioPesquisa();
  }
  get listRoute(): ISearch[] {
    return this._listRoute;
  }

  routefilteredList!: ISearch[];

  private _sub!: Subscription;

  formGroup!: FormGroup<ISearchForm>;

  destroy$ = new Subject<boolean>();

  constructor(
    private readonly router: Router,
    @Inject(forwardRef(() => ETokens.TRANSLATOR_TOKEN))
    protected readonly _translatorPipe: TranslatorPipeImpl,
    private readonly _cd: ChangeDetectorRef,
  ) {
    this.buildForm();
  }

  private buildForm(): void {
    this.formGroup = new FormGroup<ISearchForm>({
      search: new FormControl(null),
    });
  }

  public getField(field: string): AbstractControl<string> {
    return this.formGroup.get(field) as AbstractControl<string>;
  }

  public async redirectPage(): Promise<void> {
    const control = this.getField('search');
    await this.router.navigate([control.value]);
    this.reloadPage();
  }

  public openInNewPage(router: string): void {
    window.open(router, '_blank');
  }

  public reloadPage(): void {
    window.location.reload();
  }

  private filterFormularioPesquisa(): void {
    this._sub = this.getField('search')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((value: string) => {
        if (value && value.length >= 3) {
          this.routefilteredList = this.filter(value);
        }
        if (value === '') {
          this.routefilteredList = [];
        }
        this._cd.markForCheck();
      });
  }

  private translationFormularioPesquisa(searchs: ISearch[]): ISearch[] {
    return searchs.map(
      ({ formularioLabel, formularioValue, menuLabel, rota, subMenuLabel }) => {
        const search: ISearch = {
          formularioLabel: this._translatorPipe.transform(formularioLabel),
          formularioValue,
          menuLabel: this._translatorPipe.transform(menuLabel),
          rota,
        };
        if (subMenuLabel) {
          search.subMenuLabel = this._translatorPipe.transform(subMenuLabel);
        }

        search.label = this.buildLabel(
          search.menuLabel,
          search.formularioLabel,
          search.subMenuLabel,
        );
        return search;
      },
    );
  }

  private buildLabel(
    menu: string,
    formulario: string,
    subMenu?: string,
  ): string {
    if (subMenu) {
      return `${menu} / ${subMenu} / ${formulario}`;
    } else {
      return `${menu} / ${formulario}`;
    }
  }

  private filter(value: string): ISearch[] {
    const filterValueArray = this.formatValueSearch(value).split(' ');
    return this.listRoute.filter((option) =>
      this.isIncluded(
        this.formatValueSearch(option.label as string),
        filterValueArray,
      ),
    );
  }

  private formatValueSearch(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      ?.replace(/[\u0300-\u036f]/g, '');
  }

  private isIncluded(value: string, wordsFilter: Array<string>): boolean {
    for (const wordFilter of wordsFilter) {
      if (!value.includes(wordFilter)) return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this._sub?.unsubscribe();
  }
}
