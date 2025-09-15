import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  imageListagemProdutoPDVEnumToArray,
  imageLoginEnumToArray,
  imageLogotiposEnumToArray,
  imagePageEnumToArray,
  imagesCopyrightEnumToArray,
  imagesEnumToArray,
} from '../enums/images.enum';

@Component({
  selector: 'vr-design-guide-imagens',
  templateUrl: './design-guide-imagens.component.html',
  styleUrls: ['./design-guide-imagens.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignGuideImagensComponent {
  allImages = [
    { nome: 'Imagens', images: imagesEnumToArray() },
    { nome: 'Copyright', images: imagesCopyrightEnumToArray() },
    {
      nome: 'Listagem de Produtos PDV',
      images: imageListagemProdutoPDVEnumToArray(),
    },
    { nome: 'Login', images: imageLoginEnumToArray() },
    { nome: 'Logotipos', images: imageLogotiposEnumToArray() },
    { nome: 'Page', images: imagePageEnumToArray() },
  ];

  getDescriptionIcon(icon: string): string {
    return icon?.replace('vr-', '');
  }

  copyToClipboard(icon: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = this.getDescriptionIcon(icon);
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');

    document.body.removeChild(textarea);
  }
}
