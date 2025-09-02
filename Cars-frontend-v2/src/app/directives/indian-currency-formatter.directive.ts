import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appIndianCurrencyFormatter]',
  standalone: true
})
export class IndianCurrencyFormatterDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.value) return;

    // Remove non-digits
    const rawValue = input.value.replace(/\D/g, '');
    if (!rawValue) {
      this.control.control?.setValue(null);
      return;
    }

    // Format for UI
    const formattedValue = '₹' + this.formatIndianNumber(rawValue);

    // ✅ Update UI (display)
    input.value = formattedValue;

    // ✅ Update reactive form control (raw number)
    this.control.control?.setValue(Number(rawValue), {
      emitEvent: true,      // tell Angular it changed
      emitModelToViewChange: false, // don't overwrite input UI
      emitViewToModelChange: true
    });
  }

  private formatIndianNumber(value: string): string {
    if (value.length <= 3) return value;
    const lastThree = value.slice(-3);
    const otherDigits = value.slice(0, -3);
    return otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
}
