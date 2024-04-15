import { LeastSoldProduct } from '@/api/interfaces/dashboard.interface';
import { CardHeaderComponent } from '@/components/card-header/card-header.component';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-table-least-sol-products',
  standalone: true,
  imports: [CardHeaderComponent],
  templateUrl: './table-least-sol-products.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableLeastSolProductsComponent {
  leastSoldProducts = input.required<LeastSoldProduct[]>();
}
