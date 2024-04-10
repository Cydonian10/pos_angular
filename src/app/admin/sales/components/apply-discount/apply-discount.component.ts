import { Discount } from '@/api/interfaces/discount.interface';
import { ProductService } from '@/api/services/product.service';
import { PostItem } from '@/core/interfaces/post.interface';
import { PosService } from '@/core/services/pos.service';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CurrencyPipe, NgClass, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-applay-discount',
  standalone: true,
  imports: [NgClass, UpperCasePipe, CurrencyPipe],
  templateUrl: './apply-discount.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyDiscountComponent {
  #productSrv = inject(ProductService);
  #posSrv = inject(PosService);

  discounts = signal<Discount[]>([]);

  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data?: PostItem,
  ) {}

  ngOnInit() {
    this.#productSrv.getDiscounts(this.data!.product.id).subscribe((resp) => {
      this.discounts.set(resp);
    });
  }

  applyDiscount(discount: number) {
    this.data!.discount = discount;

    this.#posSrv.addProduct(this.data!);

    this.dialogRef.close();
  }
}
