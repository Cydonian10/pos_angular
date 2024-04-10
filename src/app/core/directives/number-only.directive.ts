import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true,
})
export class NumberOnlyDirective {
  constructor(private readonly elRef: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onChangeInput(event: Event): void {
    console.log(this.elRef.nativeElement.value.length);
    if (this.elRef.nativeElement.value.length > 8) {
      this.elRef.nativeElement.value = this.elRef.nativeElement.value.slice(
        0,
        -1,
      );
      event.stopPropagation();
    }
  }
}
