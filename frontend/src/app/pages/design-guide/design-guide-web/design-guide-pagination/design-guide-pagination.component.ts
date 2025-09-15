import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vr-design-guide-pagination',
  templateUrl: './design-guide-pagination.component.html',
  styleUrls: ['./design-guide-pagination.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignGuidePaginationComponent implements OnInit {
  template!: string;

  ngOnInit(): void {
    this.template = `<nav aria-label="Page Navigation">
    <ul class="pager">
      <li><a>Anterior</a></li>
      <li class="pager--next">
        <i class="vr vr-divisa_esquerda"></i>
      </li>
      <li class="pager--current"><a>1</a></li>
      <li><a>2</a></li>
      <li><a>3</a></li>
      <li><a>4</a></li>
      <li><a>5</a></li>
      <li class="pager--prev">
        <i class="vr vr-divisa_direita"></i>
      </li>
      <li class="pager--hidden"><a>...</a></li>
      <li class="pager--higher-element"><a>99999</a></li>
      <li><a>Próximo</a></li>
    </ul>
  </nav>`;
  }
}
