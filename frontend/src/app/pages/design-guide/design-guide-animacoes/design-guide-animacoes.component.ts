import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'vr-design-guide-icones',
  templateUrl: './design-guide-animacoes.component.html',
  styleUrls: ['./design-guide-animacoes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignGuideAnimacoesComponent implements OnInit {
  template!: string;

  animationBehaverSelected!: string;

  @ViewChild('divAnimation') divAnimation!: ElementRef;

  constructor(private readonly _rederer: Renderer2) {}

  ngOnInit(): void {
    this.template = `
    <!-- ANIMAÇÕES DEFAULT -->

    <div class="up"></div>
    <div class="down"></div>
    <div class="pop"></div>
    <div class="fade"></div>
    <div class="pulse"></div>

    <!-- UNINDO ANIMAÇÕES -->

    <style>
      .minha-clase {
        animation: fade 200ms normal, up 200ms forwards;
      }
    </style>

    <div class="minha-clase"></div>
    `;
  }

  changeAnimation(animationSelected: Event): void {
    const targetValue = (animationSelected.target as HTMLSelectElement).value;

    console.log(animationSelected);

    this._rederer.addClass(this.divAnimation.nativeElement, targetValue);

    if (this.animationBehaverSelected) {
      this._rederer.removeClass(
        this.divAnimation.nativeElement,
        this.animationBehaverSelected,
      );
    }

    this.animationBehaverSelected = targetValue;
  }
}
