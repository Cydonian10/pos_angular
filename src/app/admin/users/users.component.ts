import { CreateUserDto, User } from '@/api/interfaces/user.interface';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { UserStore } from '@/core/store/user.store';
import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormUserComponent } from './components/form-user/form-user.component';
import { FilterUserComponent } from './components/filter-user/filter-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgClass, AdminTitleComponent, FilterUserComponent],
  templateUrl: './users.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent {
  #userStore = inject(UserStore);
  #router = inject(Router);
  #dialog = inject(Dialog);

  userState = this.#userStore.state;

  openForm(user?: User) {
    this.#dialog
      .open(FormUserComponent, {
        height: '100%',
        data: user,
      })
      .closed.subscribe((resp: any) => {
        if (resp === false || resp === undefined) return;
        if (resp.id) {
          const { id, ...rest } = resp;
        } else {
          this.submitCreate(resp);
        }
      });
  }

  submitCreate(dto: CreateUserDto) {
    this.#userStore.crear(dto);
  }

  submitUpdate(dto: CreateUserDto, id: string) {}

  filterData(event: string) {
    this.#userStore.filterData({ rol: event });
  }

  removeFilter() {
    this.#userStore.getAll();
  }

  detalle(user: User) {
    this.#router.navigateByUrl(`/admin/users/${user.id}`);
  }

  remove(user: User) {
    const value = window.confirm(
      `Desea eliminar el usuario ${user.name.toUpperCase()}`,
    );
  }
}
