import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'admin-title',
  standalone: true,
  imports: [],
  templateUrl: './admin-title.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminTitleComponent {
  title = input.required<string>(); // @Input set() {}
  onClick = output<void>();
}
