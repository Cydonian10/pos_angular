import { Supplier } from '@/api/interfaces/supplier.interface';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'purchase-suppliers',
  standalone: true,
  imports: [],
  templateUrl: './purchase-suppliers.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseSuppliersComponent {
  supplier = input.required<Supplier>();
  showButton = input(true);

  onSelectSupplier = output<Supplier>();

  selectSupplier() {
    this.onSelectSupplier.emit(this.supplier());
  }
}
