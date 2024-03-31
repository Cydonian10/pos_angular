import { SideService } from '@/core/services/side.service';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

type ModalWidth = 'w-sm' | 'w-md' | 'w-lg';

@Component({
  selector: 'app-side',
  standalone: true,
  imports: [NgClass],
  templateUrl: './side.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideComponent {
  #sideSrv = inject(SideService);
  public open = this.#sideSrv.open;

  @Input() width: ModalWidth = 'w-sm';

  mapWidth: Record<ModalWidth, Record<string, boolean>> = {
    'w-sm': {
      'max-w-[400px]': true,
    },
    'w-md': {
      'max-w-[700px]': true,
    },
    'w-lg': {
      'max-w-[1100px]': true,
    },
  };

  get widths() {
    const width = this.mapWidth[this.width];

    return { ...width };
  }

  toogle() {
    this.#sideSrv.toogle();
  }
}
