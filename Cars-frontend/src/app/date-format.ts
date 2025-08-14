import { MatDateFormats } from '@angular/material/core';

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',     // what user types
  },
  display: {
    dateInput: 'DD/MM/YYYY',     // what user sees
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
