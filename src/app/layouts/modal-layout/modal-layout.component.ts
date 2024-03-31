import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type ModalWidth = 'w-sm' | 'w-md' | 'w-lg';

@Component({
  selector: 'modal-layout',
  standalone: true,
  imports: [NgClass],
  templateUrl: './modal-layout.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalLayout {
  @Input() width: ModalWidth = 'w-sm';

  mapWidth: Record<ModalWidth, Record<string, boolean>> = {
    'w-sm': {
      'w-[400px]': true,
    },
    'w-md': {
      'w-[700px]': true,
    },
    'w-lg': {
      'w-[1100px]': true,
    },
  };

  get widths() {
    const width = this.mapWidth[this.width];

    return { ...width };
  }
}
