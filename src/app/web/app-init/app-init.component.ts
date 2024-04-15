import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormEmpresaComponent } from './components/form-empresa/form-empresa.component';
import { FormUserComponent } from './components/form-user/form-user.component';
import { NgClass } from '@angular/common';
import { EmpresaService } from '@/api/services/empresa.service';

@Component({
  selector: 'app-app-init',
  standalone: true,
  imports: [FormEmpresaComponent, FormUserComponent, NgClass],
  templateUrl: './app-init.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AppInitComponent {
  #empresaSrv = inject(EmpresaService);

  nextStep = signal(false);

  constructor() {
    this.#empresaSrv.get().subscribe((resp) => {
      if (resp) {
        this.nextStep.set(true);
      }
    });
  }

  changeNextStep() {
    this.nextStep.set(true);
  }
}
