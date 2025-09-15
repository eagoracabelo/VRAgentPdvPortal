import {
  AfterContentInit,
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { VrcTabComponent } from '../vrc-tab/vrc-tab.component';

@Component({
  selector: 'vrc-tabs',
  templateUrl: './vrc-tabs.component.html',
  styleUrls: ['./vrc-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcTabsComponent implements AfterContentInit, AfterViewChecked {
  @ContentChildren(VrcTabComponent) tabs!: QueryList<VrcTabComponent>;

  @Input() borderPosition: 'bottom' | 'top' | 'left' = 'bottom';
  @Input() linePosition: 'bottom' | 'top' | 'both' = 'bottom';
  @Input() styleTab: 'hover' | 'link' = 'hover';
  @Input() subTab = false;
  @Input() customTabs = false;
  @Input() navButtons = false;
  @Input() navButtonForwardText = 'Avançar';
  @Input() buttonsPosition: 'bottom' | 'top' = 'top';
  @Input() navButtonBackText = 'Voltar';
  @Input() linearSteps = false;
  @Input() linearStepsStartIndex = -1;
  @Input() formGroup: UntypedFormGroup | UntypedFormArray | undefined;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onTabChange$ = new EventEmitter<number>();

  currentIndex: number = 0;

  constructor(private readonly cd: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.selectTab(0);
    this.cd.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.cd.detectChanges();
  }

  selectTab(index: number): void {
    if (this.isTabDisabled(index)) return;

    this.currentIndex = index;
    this.onTabChange$.emit(this.currentIndex);

    this.tabs.forEach((tab, tabIndex) => {
      tab.active = this.currentIndex === tabIndex;

      if (this.linearSteps) {
        tab.disabled = tab.disabled || this.shouldDisableTab(tabIndex);
      }
    });
  }

  private shouldDisableTab(tabIndex: number): boolean {
    return (
      (tabIndex > this.linearStepsStartIndex ||
        this.currentIndex > this.linearStepsStartIndex + 1) &&
      this.currentIndex > tabIndex
    );
  }

  isTabDisabled(index: number): boolean {
    const tab = this.tabs.get(index) as VrcTabComponent;
    return tab?.disabled;
  }

  protected findFirstInvalidControl(
    formGroup: UntypedFormGroup | UntypedFormArray,
    parentPath: string = '',
  ):
    | {
        field: string;
        control: AbstractControl;
        fullPath: string;
      }
    | undefined {
    for (const field of Object.keys(formGroup.controls)) {
      const control = formGroup.get(field);
      if (!control) continue;

      const fullPath = parentPath ? `${parentPath}.${field}` : field;

      if (control.invalid) {
        if (control instanceof UntypedFormControl) {
          return { field, control, fullPath };
        } else if (
          control instanceof UntypedFormGroup ||
          control instanceof UntypedFormArray
        ) {
          const nestedInvalidControl = this.findFirstInvalidControl(
            control,
            fullPath,
          );
          if (nestedInvalidControl) {
            return nestedInvalidControl;
          }
        }
      }
    }
    return undefined;
  }

  public focusOnFirstInvalidField(): void {
    if (!this.formGroup) {
      console.warn('Form group is not defined.');
      return;
    }

    const invalidField = this.findFirstInvalidControl(this.formGroup);

    if (invalidField) {
      this.navigateToTabWithInvalidControl(invalidField.fullPath);

      setTimeout(() => {
        const invalidElement = document.querySelector(
          `[formControlName="${invalidField.field}"]`,
        );

        if (invalidElement) {
          (invalidElement as HTMLElement).focus();
        } else {
          console.warn(
            `Unable to find an element with formControlName="${invalidField.field}".`,
          );
        }
      }, 0);
    }
  }

  private navigateToTabWithInvalidControl(fullPath: string): void {
    if (!this.tabs || !fullPath) return;

    const controlePath = fullPath.split('.').slice(0, -1).join('.');

    const targetTab = this.tabs.find((tab, index) => {
      if (tab.containsControl(controlePath)) {
        this.selectTab(index);
        return true;
      }
      return false;
    });

    if (!targetTab) {
      console.warn(`No tab contains the control path: ${controlePath}`);
    }
  }
}
