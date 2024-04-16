import { CashRegister } from '@/api/interfaces/cash-register.interface';
import { Egreso } from '@/api/interfaces/egreso.interface';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { EgresoService } from '@/api/services/egreso.service';
import { Dialog } from '@angular/cdk/dialog';
import { CurrencyPipe, DatePipe, Location, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { FormEgresoComponent } from '../components/form-egreso/form-egreso.component';

@Component({
  selector: 'app-detail-cash-register',
  standalone: true,
  imports: [NgClass, CurrencyPipe, DatePipe],
  templateUrl: './detail-cash-register.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DetailCashRegisterComponent implements OnInit {
  @Input() id: number = 0;
  #dialog = inject(Dialog);

  #cashRegisterSrv = inject(CashRegisterService);
  #egresoSrv = inject(EgresoService);
  location = inject(Location);

  total = signal(0);
  cashRegisterId = signal(0);
  egresos = signal<Egreso[]>([]);

  ngOnInit(): void {
    this.#cashRegisterSrv
      .getOne(this.id)
      .pipe(
        tap((cashRegister: CashRegister) => {
          this.total.set(cashRegister.totalCash);
          this.cashRegisterId.set(cashRegister.id);
        }),
        switchMap((cashRegister: CashRegister) =>
          this.#egresoSrv.get({
            createDate: new Date().toISOString(),
            cashRegisterId: cashRegister.id,
          }),
        ),
      )
      .subscribe((resp) => {
        this.egresos.set(resp);
      });
  }

  openNewEgreso() {
    this.#dialog
      .open(FormEgresoComponent, {
        height: '100%',
        data: this.cashRegisterId(),
      })
      .closed.subscribe((resp: any) => {
        if (!resp) return;
        this.#egresoSrv.create(resp).subscribe((egreso: Egreso) => {
          this.egresos.update((e) => [...e, egreso]);
          if (egreso.egreso === 1) {
            this.total.update((v) => v + egreso.monto);
          } else {
            this.total.update((v) => v - egreso.monto);
          }
        });
      });
  }
}
