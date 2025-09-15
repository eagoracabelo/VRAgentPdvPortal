import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ETokens } from '../../../../enums/tokens.enum';
import { TranslatorPipe } from '../../../../pipes/translator.pipe';
import { MoveSelectedEventComponent } from './move-selected-event.component';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('MoveSelectedEventComponent', () => {
  let component: MoveSelectedEventComponent;
  let fixture: ComponentFixture<MoveSelectedEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MoveSelectedEventComponent, TranslatorPipe],
      providers: [
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveSelectedEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dispatchEvent', () => {
    const spy = spyOn(window, 'dispatchEvent');
    component.dispatchEvent();
    expect(spy).toHaveBeenCalled();
  });
});
