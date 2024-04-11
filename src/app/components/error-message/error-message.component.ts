import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [],
  templateUrl: './error-message.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorMessageComponent {
  constructor(
    public dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA)
    public data?: any,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
