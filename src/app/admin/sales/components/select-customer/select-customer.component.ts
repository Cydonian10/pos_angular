import { Customer } from '@/api/interfaces/customer.interface';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

@Component({
  selector: 'app-select-customer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './select-customer.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCustomerComponent {
  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public customers?: Customer[],
  ) {}
}
