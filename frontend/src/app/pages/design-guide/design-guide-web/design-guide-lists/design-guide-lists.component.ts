import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vr-design-guide-lists',
  templateUrl: './design-guide-lists.component.html',
  styleUrls: ['./design-guide-lists.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignGuideListsComponent implements OnInit {
  template!: string;

  ngOnInit(): void {
    this.template = ` <div class="row">

    <div class="col-sm-6">
      <ul class="list">
        <li> Listas não ordenadas têm estilos básicos </li>
        <li>Eles usam o estilo da lista de círculos
          <ul>
            <li>Listas aninhadas estilizadas para se sentirem bem</li>
            <li>Pode aninhadas qualquer tipo de lista no outro</li>
          </ul>
        </li>
        <li> Apenas mais itens de lista </li>
      </ul>
    </div>

    <div class="col-sm-6">
      <ol class="list">
        <li> As listas ordenadas também têm estilos básicos </li>
        <li>
          Eles usam o estilo da lista decimal
          <ul>
            <li> Pedidos e não ordenados podem ser aninhados </li>
            <li> Pode aninhar qualquer tipo de lista no outro </li>
          </ul>
        </li>
        <li> Último item da lista apenas para diversão </li>
      </ol>
    </div>

  </div>`;
  }
}
