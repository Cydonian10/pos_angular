import { CashRegister } from '@/api/interfaces/cash-register.interface';
import { AdminTitleComponent } from '@/components/admin-title/admin-title.component';
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
import { CashRegistersStore } from '@/store/cash-registers.store';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [NgClass, AdminTitleComponent, RouterLink],
  templateUrl: './cash-register.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CashRegisterComponent implements OnInit {
  readonly cashRegisterStore = inject(CashRegistersStore);
  #dialog = inject(Dialog);

  ngOnInit(): void {
    this.cashRegisterStore.getAll();
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
        } else {
          this.createCashRegister(resp);
        }
      });
  }

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
          this.cashRegisterStore.openCash(rest, id);
        }
      });
  }

  removeUserCashRegiser(cashRegister: CashRegister) {
    const confirm = window.confirm(
      `Desea remover el usuario  con id:  ${cashRegister.userId.toUpperCase()}`,
    );
  }

  updateCashRegister(dto: UpdateCustomerDto, id: number) {
    this.cashRegisterStore.update(dto, id);
  }

  createCashRegister(value: any) {
    console.log(value.name);
    this.cashRegisterStore.createCashRegister({
      date: new Date(),
      name: value.name,
    });
  }
}
