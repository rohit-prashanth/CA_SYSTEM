import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request';
import {
  CCBClassification,
  CCBScope,
  ITVertical,
  SBU,
} from '../../models/models';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { formatDate } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS } from '../../date-format';
import { Dashboard } from '../dashboard/dashboard';
import { AuthService } from '../../services/auth';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IndianCurrencyFormatterDirective } from '../../directives/indian-currency-formatter.directive';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    Dashboard,
    RouterOutlet,
    IndianCurrencyFormatterDirective,
  ],
  templateUrl: './create-request.html',
  styleUrl: './create-request.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    DatePipe,
  ],
})
export class CreateRequest implements OnInit {
  form: FormGroup = new FormGroup({});
  formattedDate: string = '';
  verticals: any[] = [];
  sbus: any[] = [];
  ccbScopes: any[] = [];
  ccbClassification: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private requestService: RequestService,
    private datePipe: DatePipe,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const today = new Date();

    // Format to YYYY-MM-DD (for backend value)
    const backendDate = today.toISOString().split('T')[0]; // e.g., "2025-08-08"

    // Format to MM/DD/YYYY (for display only)
    this.formattedDate = `${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${today
      .getDate()
      .toString()
      .padStart(2, '0')}/${today.getFullYear()}`;

    // Create the form here instead of constructor
    this.form = this.fb.group({
      change_title: ['', Validators.required],
      executive_sponsor: ['', Validators.required],
      proposal_date: [backendDate], // ✅ set after defining backendDate
      it_vertical: [null],
      sbu: [null],
      scope_of_change: [null],
      change_class: [null],
      budgeted: ['YES'],
      budget_value: ['', Validators.required],
      submitted_by: ['', Validators.required],
      project_manager: ['', Validators.required],
      plan_go_live_date: [null],
      actual_go_live_date: [null],
    });

    // this.form.get('budget_value')?.valueChanges.subscribe((val) => {
    //   console.log('Form value for budget_value:', val);
    // });

    this.loadITVerticals();
    this.loadSBUs();
    this.loadCCBScopes();
    this.loadCCBClassification();

    this.form.patchValue({
      submitted_by: this.authService.rowId, // <-- rowId goes to form
    });
  }

  loadITVerticals() {
    this.requestService.getItVerticals().subscribe({
      next: (res: ITVertical[]) => {
        this.verticals = res.filter((v: ITVertical) => v.is_active);

        // ✅ Set default value AFTER verticals are loaded
        const defaultId = this.verticals[0]?.row_id ?? null; // pick first item or null
        this.form.patchValue({ it_vertical: defaultId });
      },
      error: (err) => {
        console.error('Failed to load IT verticals', err);
      },
    });
  }

  loadSBUs() {
    this.requestService.getSBUs().subscribe({
      next: (res: SBU[]) => {
        this.sbus = res.filter((v: SBU) => v.is_active);

        // ✅ Set default value AFTER sbus are loaded
        const defaultId = this.sbus[0]?.row_id ?? null; // pick first item or null
        this.form.patchValue({ sbu: defaultId });
      },
      error: (err) => {
        console.error('Failed to load SBUs', err);
      },
    });
  }

  loadCCBScopes() {
    this.requestService.getCCBScopes().subscribe({
      next: (res: CCBScope[]) => {
        this.ccbScopes = res.filter((v: CCBScope) => v.is_active);

        // ✅ Set default value AFTER sbus are loaded
        const defaultId = this.ccbScopes[0]?.row_id ?? null; // pick first item or null
        this.form.patchValue({ scope_of_change: defaultId });
      },
      error: (err) => {
        console.error('Failed to load SBUs', err);
      },
    });
  }

  loadCCBClassification() {
    this.requestService.getCCBClassification().subscribe({
      next: (res: CCBClassification[]) => {
        this.ccbClassification = res.filter(
          (v: CCBClassification) => v.is_active
        );

        // ✅ Set default value AFTER sbus are loaded
        const defaultId = this.ccbClassification[0]?.row_id ?? null; // pick first item or null
        this.form.patchValue({ change_class: defaultId });
      },
      error: (err) => {
        console.error('Failed to load CCBClassification', err);
      },
    });
  }

  // Format date as yyyy/MM/dd
  formatDate(value: any): string | null {
    if (!value) return null;
    try {
      // return formatDate(value, 'yyyy/MM/dd', 'en-US');
      return this.datePipe.transform(value, 'yyyy-MM-dd');
    } catch {
      return value;
    }
  }

  // Triggered on date picker change
  onDateChange(event: any, controlName: string): void {
    const selectedDate = event.value;
    const formatted = this.formatDate(selectedDate);
    this.form.get(controlName)?.setValue(formatted);
  }

  // onSubmit() {
  //   if (this.form.valid) {
  //     // const formatDate = (date: Date): string | null => {
  //     //   return date
  //     //     ? date.toISOString().split('T')[0].replace(/-/g, '/')
  //     //     : null;
  //     // };

  //     const formattedPlanDate = this.formatDate(
  //       this.form.value.plan_go_live_date
  //     );
  //     const formattedActualDate = this.formatDate(
  //       this.form.value.actual_go_live_date
  //     );

  //     this.form.patchValue({
  //       plan_go_live_date: formattedPlanDate,
  //       actual_go_live_date: formattedActualDate,
  //     });
  //     const formData = this.form.value;
  //     console.log('Submitting:', formData);

  //     this.requestService.submitCCBRequests(formData).subscribe({
  //       next: (response) => {
  //         console.log('Request submitted successfully:', response);
  //         alert('Request submitted successfully!');
  //       },
  //       error: (error) => {
  //         console.error('Error submitting request:', error);
  //         alert('Something went wrong. Please try again.');
  //       },
  //     });
  //   } else {
  //     this.form.markAllAsTouched();
  //     alert('Please fill out all required fields.');
  //   }
  // }

  onSubmit() {
    if (this.form.valid) {
      const rawForm = this.form.getRawValue();

      const formattedPlanDate = this.formatDate(rawForm.plan_go_live_date);
      const formattedActualDate = this.formatDate(rawForm.actual_go_live_date);

      const formData = {
        ...rawForm,
        it_vertical: rawForm.it_vertical ? Number(rawForm.it_vertical) : null,
        sbu: rawForm.sbu ? Number(rawForm.sbu) : null,
        scope_of_change: rawForm.scope_of_change
          ? Number(rawForm.scope_of_change)
          : null,
        change_class: rawForm.change_class
          ? Number(rawForm.change_class)
          : null,
        submitted_by: this.authService.rowId,
        plan_go_live_date: formattedPlanDate,
        actual_go_live_date: formattedActualDate,
        change_status:2
      };

      console.log('Submitting:', formData);

      this.requestService.submitCCBRequests(formData).subscribe({
        next: (response) => {
          console.log('Request submitted successfully:', response);

          this.snackBar.open('✅ Request submitted successfully!', 'Close', {
            duration: 3000, // auto close after 3s
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'], // custom class for styling
          });

          // ✅ Reset form with defaults
          const today = new Date();
          const backendDate = today.toISOString().split('T')[0];

          this.form.reset({
            proposal_date: backendDate,
            submitted_by: this.authService.rowId,
            budgeted: 'YES',
            it_vertical: this.verticals[0]?.row_id ?? null,
            sbu: this.sbus[0]?.row_id ?? null,
            scope_of_change: this.ccbScopes[0]?.row_id ?? null,
            change_class: this.ccbClassification[0]?.row_id ?? null,
          });

          // ✅ Reset display date
          this.formattedDate = `${(today.getMonth() + 1)
            .toString()
            .padStart(2, '0')}/${today
            .getDate()
            .toString()
            .padStart(2, '0')}/${today.getFullYear()}`;

          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error submitting request:', error);
          alert('Something went wrong. Please try again.');
        },
      });
    } else {
      this.form.markAllAsTouched();
      alert('Please fill out all required fields.');
    }
  }

  onCancel() {
    this.router.navigate(['/']); // Change '/dashboard' to your desired route
  }
}
