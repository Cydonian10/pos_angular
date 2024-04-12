import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [],
  templateUrl: './card-header.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHeaderComponent {
  title = input.required<string>();
}
