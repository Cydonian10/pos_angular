import { ProductsLowStock } from '@/api/interfaces/dashboard.interface';
import { CardHeaderComponent } from '@/components/card-header/card-header.component';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-table-products-low-stock',
  standalone: true,
  imports: [CardHeaderComponent],
  templateUrl: './table-products-low-stock.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableProductsLowStockComponent {
  public productsLowStock = input.required<ProductsLowStock[]>();
}
