import { PostItem } from '@/core/interfaces/post.interface';
import { Dialog } from '@angular/cdk/dialog';
import { CurrencyPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { ApplyDiscountComponent } from '../apply-discount/apply-discount.component';
import { CreateSaleDto } from '@/api/interfaces/sale.interface';
import { SaleService } from '@/api/services/sale.service';
import { AlertService } from '@/core/services/alert.service';
import { Customer } from '@/api/interfaces/customer.interface';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'pos-items-table',
  standalone: true,
  imports: [CurrencyPipe, NgClass, ReactiveFormsModule],
  templateUrl: './pos-items-table.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosItemsTableComponent implements OnInit {
  #saleSrv = inject(SaleService);
  #alertSrv = inject(AlertService);
  #dialog = inject(Dialog);

  posItems = input.required<PostItem[]>();
  subTotal = input.required<string>();
  igv = input.required<string>();
  totalDescuento = input.required<number>();
  totalPrice = input.required<number>();
  cashRegisterId = input.required<number | undefined>();
  customer = input.required<Customer | undefined>();

  onClearProductItems = output<void>();
  onRemoveProduct = output<PostItem>();

  showCashMethod = false;
  cashReturn = 0;
  paymentMethod = new FormControl<'cash' | 'card'>('cash', [
    Validators.required,
  ]);
  cashPayment = new FormControl<number>(0, [Validators.required]);

  openDiscounts(posItem: PostItem) {
    this.#dialog.open(ApplyDiscountComponent, {
      data: posItem,
    });
  }

  ngOnInit(): void {
    this.paymentMethod.valueChanges.subscribe((resp) => {
      console.log(resp);
    });
  }

  calculateCashReturn() {
    this.cashReturn = this.cashPayment.getRawValue()! - this.totalPrice();
  }

  handleSubmitCreateSaleDto() {
    const data: CreateSaleDto = {
      taxex: 0.18,
      createDate: new Date(),
      cashRegisterId: this.cashRegisterId()!,
      customerId: this.customer()!.id,
      statusCompra: 1,
      totalPrice: this.totalPrice(),
      saleDetails: this.posItems(),
    };

    this.#saleSrv.createSale(data).subscribe({
      next: () => {
        this.#alertSrv.showAlertSuccess('[Success] Venta Realizada');
        window.print();
      },
      error: (err) => {
        console.log('[Error component] 😡 error 💥💥', err);
        this.#alertSrv.showAlertError('error');
      },
    });
  }
}
