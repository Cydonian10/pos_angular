import { UserService } from '@/api/services/user.service';
import { AlertService } from '../services/alert.service';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  CreateUserDto,
  LoginUserDto,
  User,
  UserAuth,
  UserToken,
} from '@/api/interfaces/user.interface';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

type UserState = {
  users: User[];
  isLoading: boolean;
  currentUser: UserAuth | undefined;
  currentRoles: string[];
  roles: string[];
};

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  #userSrv = inject(UserService);
  #alertSrv = inject(AlertService);
  #router = inject(Router);
  #tokenSrv = inject(TokenService);

  #state = signal<UserState>({
    users: [],
    isLoading: false,
    currentUser: undefined,
    currentRoles: [],
    roles: [],
  });

  state = computed(() => this.#state());

  constructor() {
    // effect(() => {
    //   console.log('**** State Users *****');
    //   console.log(this.#state());
    // });
    this.getRoles();
  }

  getAll() {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#userSrv.getAll().subscribe({
      next: (users: User[]) => {
        this.#state.update((s) => ({ ...s, users }));
      },
      error: () => {
        this.#alertSrv.showAlertError('Error');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  getRoles() {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#userSrv.getRoles().subscribe({
      next: (roles: string[]) => {
        this.#state.update((s) => ({ ...s, roles }));
      },
      error: () => {
        this.#alertSrv.showAlertError('Error');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  filterData(filter: { rol: string }) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#userSrv.filterData(filter).subscribe({
      next: (users: User[]) => {
        this.#state.update((s) => ({ ...s, users }));
        this.#alertSrv.showAlertSuccess(`Filtro ${filter.rol} aplicado`);
      },
      error: () => {
        this.#alertSrv.showAlertError('Error');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  crear(dto: CreateUserDto) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#userSrv.registerUser(dto).subscribe({
      next: (userTokem: UserToken) => {
        this.#state.update((s) => ({
          ...s,
          users: [userTokem.user, ...s.users],
        }));
        this.#alertSrv.showAlertSuccess(`El elmento ${dto.name} creado`);
      },
      error: (error) => {
        if (error.error.errors) {
          this.#alertSrv.showAlertError('Error de validacioines 💥');
        }
        this.#alertSrv.showAlertError('Error 💥');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }
  update() {}

  login(dto: LoginUserDto) {
    this.#userSrv.login(dto).subscribe({
      next: (userAuth: UserAuth) => {
        this.#state.update((s) => ({
          ...s,
          currentUser: userAuth,
        }));
        this.#alertSrv.showAlertSuccess(`${userAuth.name} Iniciaste Sessión`);
        this.#router.navigateByUrl('/admin');
      },
      error: (error) => {
        if (error.error.errors) {
          this.#alertSrv.showAlertError('Error de validacioines 💥');
        }
        this.#alertSrv.showAlertError('Error 💥');
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  profile() {
    const token = this.#tokenSrv.getToken();

    if (token) {
      this.#userSrv.profile().subscribe({
        next: (userAuth: UserAuth) => {
          this.#state.update((s) => ({
            ...s,
            currentUser: userAuth,
          }));
          this.#alertSrv.showAlertSuccess(`${userAuth.name} Iniciaste Sessión`);
        },
        error: (error) => {
          if (error.error.errors) {
            this.#alertSrv.showAlertError('Error de validacioines 💥');
          }
          this.#alertSrv.showAlertError('Error 💥');
        },
        complete: () => {
          this.#state.update((s) => ({ ...s, isLoading: false }));
        },
      });
    }
  }

  logout() {
    this.#tokenSrv.removeToken();
  }
}
