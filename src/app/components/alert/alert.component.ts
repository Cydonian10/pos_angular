import { Alert, AlertService } from '@/core/services/alert.service';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styles: `
    .caja {
      animation: descender 0.5s ease;
    }

    @keyframes descender {
      0% {
        opacity: 0.5;
        transform: translateY(-100px);
      }
      100% {
        opacity: 1;
        transform: translateY(0px);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  #alertService = inject(AlertService);

  @Input() message: string = '';

  @Input() alert: Alert = 'Success';

  mapAlert: Record<Alert, Record<'color' | 'text' | 'icon' | 'type', string>> =
    {
      Error: {
        color: 'bg-red-500',
        text: 'text-red-500',
        icon: 'bx bxs-error',
        type: 'Error',
      },
      Success: {
        color: 'bg-green-500',
        text: 'text-green-500',
        icon: 'bx bx-check',
        type: 'Success',
      },
      Warning: {
        color: 'bg-amber-500',
        text: 'text-amber-500',
        icon: 'bx bx-error-alt',
        type: 'Warning',
      },
    };

  get alerts() {
    const alert = this.mapAlert[this.alert];

    return alert;
  }

  closeAlert() {
    this.#alertService.config.update((old) => {
      return { ...old, show: false };
    });
  }
}
