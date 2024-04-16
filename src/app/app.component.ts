import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UserStore } from './core/store/user.store';
import { CashRegistersStore } from './store/cash-registers.store';
import { AppInitService } from './api/services/appinit.service';
import { AlertService } from './core/services/alert.service';
import { AlertComponent } from './components/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  #userStore = inject(UserStore);
  readonly cashRegisterStore = inject(CashRegistersStore);
  readonly appInitSrv = inject(AppInitService);
  readonly router = inject(Router);
  readonly alertConfig = inject(AlertService).config;

  constructor() {
    const theme = localStorage.getItem('theme');
    document.documentElement.setAttribute('data-theme', theme!);
    this.#userStore.profile();
    this.cashRegisterStore.loadCurrentCashRegister();
    this.appInit();
  }

  appInit() {
    this.appInitSrv.getStatusAppInit().subscribe((resp) => {
      console.log(resp);
      if (resp.msg === 'Iniciar la App') {
        this.router.navigateByUrl('/web/init');
      }
    });
  }
}
