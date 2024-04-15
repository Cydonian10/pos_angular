import { TopSales } from '@/api/interfaces/dashboard.interface';
import { CardHeaderComponent } from '@/components/card-header/card-header.component';
import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-table-top-sales',
  standalone: true,
  imports: [CurrencyPipe, CardHeaderComponent],
  templateUrl: './table-top-sales.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableTopSalesComponent {
  topSales = input.required<TopSales[]>();
}
