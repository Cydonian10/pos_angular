import { CashRegister } from '@/api/interfaces/cash-register.interface';
import { UserAuth } from '@/api/interfaces/user.interface';
import { OverlayModule } from '@angular/cdk/overlay';
import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'select-cash-register',
  standalone: true,
  imports: [OverlayModule, JsonPipe],
  templateUrl: './select-cash-register.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCashRegisterComponent {
  isOpen = false;

  cashRegisters = input.required<CashRegister[]>();
  userAuth = input.required<UserAuth>();

  onCloseCashRegister = output<CashRegister>();
  onSelectCashRegister = output<CashRegister>();
}
