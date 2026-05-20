import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReservaService } from '../../../services/reserva.service';
import { HuespedService } from '../../../services/huesped.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-reserva-dialog',
  imports: [
    MatDialogModule, MatToolbarModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule,
    ReactiveFormsModule, MatSelectModule
  ],
  templateUrl: './reserva-dialog.component.html',
  styleUrl: './reserva-dialog.component.css'
})
export class ReservaDialogComponent {
  private readonly service = inject(ReservaService);
  private readonly huespedService = inject(HuespedService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ReservaDialogComponent>);

  protected $huespedes = toSignal(this.huespedService.findAll(), { initialValue: [] });
  protected $isEdit = signal(this.data != null && this.data.id > 0);

  protected $form = signal(new FormGroup({
    id: new FormControl<number | null>(this.data?.id ?? null),
    huesped: new FormControl<any>(this.data?.huesped ?? null, [Validators.required]),
    fechaIngreso: new FormControl<string>(this.data?.fechaIngreso ?? '', [Validators.required]),
    fechaSalida: new FormControl<string>(this.data?.fechaSalida ?? '', [Validators.required]),
    totalPagar: new FormControl<number | null>(this.data?.totalPagar ?? null),
    estado: new FormControl<string>(this.data?.estado ?? 'PENDIENTE', [Validators.required]),
    observaciones: new FormControl<string>(this.data?.observaciones ?? '')
  }));

  protected $f = () => this.$form().controls;
  protected estados = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA'];

  compareHuesped(a: any, b: any): boolean {
    return a && b ? a.id === b.id : a === b;
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;
    const reserva: any = form.value;
    const isEdit = this.$isEdit();
    const msg = isEdit ? 'ACTUALIZADO' : 'CREADO';
    const op$ = isEdit ? this.service.update(reserva.id, reserva) : this.service.save(reserva);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(msg))
    ).subscribe(() => this.close());
  }

  close() {
    this.dialogRef.close();
  }
}