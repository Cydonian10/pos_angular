import { AddRolDto, User } from '@/api/interfaces/user.interface';
import { UserService } from '@/api/services/user.service';
import { AlertService } from '@/core/services/alert.service';
import { UserStore } from '@/core/store/user.store';
import { DatePipe, TitleCasePipe } from '@angular/common';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-detail-user',
  standalone: true,
  imports: [TitleCasePipe, DatePipe],
  templateUrl: './detail-user.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DetailUserComponent implements OnInit {
  #userSrv = inject(UserService);
  #userStore = inject(UserStore);
  #alertSrv = inject(AlertService);

  userState = this.#userStore.state;

  @Input() id: string = '';

  user = signal<User | null>(null);
  roles = signal<string[]>([]);

  rolesShort = computed(() => {
    return this.#userStore.state().roles.sort((a, b) => {
      if (this.roles().includes(a) && !this.roles().includes(b)) {
        return -1; // a viene antes que b
      } else if (!this.roles().includes(a) && this.roles().includes(b)) {
        return 1; // b viene antes que a
      } else {
        return 0; // el orden no cambia
      }
    });
  });

  ngOnInit(): void {
    this.#userSrv.getUserAndRole(this.id).subscribe((resp) => {
      this.user.set(resp[0]);
      this.roles.set(resp[1]);
    });
  }

  checkRol(rol: string) {
    const resp = this.roles().includes(rol);
    if (resp) {
      console.log(rol);
    }
  }

  addRol(email: string, rol: string) {
    const dto: AddRolDto = { email, roles: [rol] };
    this.#userSrv.addRol(dto).subscribe(() => {
      this.roles.update((r) => [...r, rol]);
      this.#alertSrv.showAlertSuccess(`Rol ${rol} agregado`);
    });
  }

  removeRol(email: string, rol: string) {
    const dto: AddRolDto = { email, roles: [rol] };
    this.#userSrv.removeRol(dto).subscribe(() => {
      this.roles.update((r) => r.filter((r) => r !== rol));
      this.#alertSrv.showAlertSuccess(`Rol ${rol} eliminado`);
    });
  }
}
