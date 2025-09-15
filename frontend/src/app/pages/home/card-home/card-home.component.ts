import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vr-card-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-home.component.html',
  styleUrl: './card-home.component.scss',
})
export class CardHomeComponent {
  title = input<string>('');
  buttonLink = input<string>('');
}
