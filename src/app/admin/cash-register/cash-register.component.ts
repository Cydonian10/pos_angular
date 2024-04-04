import { CashRegister } from '@/api/interfaces/cash-register.interface';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
import { CashRegisterStore } from '@/core/store/cash-register.store';
import { Dialog } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormUpdateCashComponent } from './components/form-update-cash/form-update-cash.component';
import { UpdateCustomerDto } from '@/api/interfaces/customer.interface';
import { FormOpenCashComponent } from './components/form-open-cash/form-open-cash.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [NgClass, AdminTitleComponent, RouterLink],
  templateUrl: './cash-register.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CashRegisterComponent implements OnInit {
  #storeCashRegister = inject(CashRegisterStore);
  #dialog = inject(Dialog);

  cashRegisterState = this.#storeCashRegister.state;

  ngOnInit(): void {
    this.#storeCashRegister.getAll();
  }

  openUpdate(cashRegister?: CashRegister) {
    this.#dialog
      .open(FormUpdateCashComponent, {
        height: '100%',
        data: cashRegister,
      })
      .closed.subscribe((resp: any) => {
        if (!resp) return;

        if (resp.id) {
          const { id, ...rest } = resp;
          this.updateCashRegister(rest, id);
        }
      });
  }

  remove(cashRegister: CashRegister) {}

  openCashRegister(cashRegister: CashRegister) {
    this.#dialog
      .open(FormOpenCashComponent, {
        height: '100%',
        data: cashRegister,
      })
      .closed.subscribe((resp: any) => {
        if (!resp) return;

        if (resp.id) {
          const { id, ...rest } = resp;
          this.#storeCashRegister.openCash(rest, id);
        }
      });
  }

  deleteUserCashRegiser(cashRegister: CashRegister) {
    const confirm = window.confirm(
      `Desea eliminar el usuario  con id:  ${cashRegister.userId.toUpperCase()}`,
    );
  }

  updateCashRegister(dto: UpdateCustomerDto, id: number) {
    this.#storeCashRegister.update(dto, id);
  }
}
