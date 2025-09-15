import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IShortcut } from './../interfaces/shortcut.interface';
import { FormatShortcutDirective } from './format-shortcut.directive';

@Component({
  template: `
    @for (shortcut of shortcuts; track $index) {
      <div vrFormatShortcut [shortcut]="shortcut"></div>
    }
  `,
})
class TestComponent {
  shortcuts: IShortcut[] = [
    {
      keys: ['Alt', 'S'],
      label: 'ATALHOS.SALVAR-FORMULARIO',
    },
  ];
}

describe('FormatShortcutDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directive: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, FormatShortcutDirective],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    directive = fixture.debugElement.queryAll(
      By.directive(FormatShortcutDirective),
    );
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should bind <div> content is not empty', () => {
    const divElement = directive[0].nativeElement as HTMLElement;

    expect(divElement.textContent).toEqual('Alt + S ATALHOS.SALVAR-FORMULARIO');
  });
});
