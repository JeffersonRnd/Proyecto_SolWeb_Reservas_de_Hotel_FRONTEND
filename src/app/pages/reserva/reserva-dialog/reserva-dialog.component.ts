import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReservaService } from '../../../services/reserva.service';
import { HuespedService } from '../../../services/huesped.service';
import { HabitacionService } from '../../../services/habitacion.service';
import { AuthService } from '../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-reserva-dialog',
  imports: [
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, ReactiveFormsModule,
    MatSelectModule, MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './reserva-dialog.component.html',
  styleUrl: './reserva-dialog.component.css'
})
export class ReservaDialogComponent {
  private readonly service = inject(ReservaService);
  private readonly huespedService = inject(HuespedService);
  private readonly habitacionService = inject(HabitacionService);
  private readonly auth = inject(AuthService);
  private readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ReservaDialogComponent>);

  // Lista completa de huéspedes (solo ADMIN puede consultar /api/huespedes)
  protected $huespedes = toSignal(
    this.auth.isAdmin() ? this.huespedService.findAll() : of([]),
    { initialValue: [] }
  );

  // Huésped propio del usuario autenticado (rol HUESPED) vía /api/huespedes/me
  protected $miHuesped = toSignal(
    this.auth.isHuesped() ? this.huespedService.findMe() : of(null),
    { initialValue: null }
  );

  protected $habitaciones = toSignal(this.habitacionService.findAll(), { initialValue: [] });
  protected $isEdit = signal(this.data != null && this.data.id > 0);

  // Habitacion seleccionada para calcular precio
  protected $habitacionSel = signal<any>(null);
  protected $noches = computed(() => {
    const f = this.$form();
    const ing = f.controls['fechaIngreso'].value as Date | null;
    const sal = f.controls['fechaSalida'].value as Date | null;
    if (!ing || !sal) return 0;
    const ingDate = new Date(ing.getFullYear(), ing.getMonth(), ing.getDate());
    const salDate = new Date(sal.getFullYear(), sal.getMonth(), sal.getDate());
    const diff = salDate.getTime() - ingDate.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  });
  protected $total = computed(() => {
    const hab = this.$habitacionSel();
    return hab ? (hab.precioPorNoche ?? 0) * this.$noches() : 0;
  });

  protected $form = signal(new FormGroup({
    id: new FormControl<number | null>(this.data?.id ?? null),
    huesped: new FormControl<any>(null,
      this.auth.isAdmin() ? [Validators.required] : []),
    habitacion: new FormControl<any>(null, [Validators.required]),
    fechaIngreso: new FormControl<Date | null>(
      this.data?.fechaIngreso ? new Date(this.data.fechaIngreso) : null, [Validators.required]),
    fechaSalida: new FormControl<Date | null>(
      this.data?.fechaSalida ? new Date(this.data.fechaSalida) : null, [Validators.required]),
    estado: new FormControl<string>(this.data?.estado ?? 'PENDIENTE', [Validators.required]),
    observaciones: new FormControl<string>(this.data?.observaciones ?? '')
  }));

  constructor() {
    // Cuando las listas de huéspedes/habitaciones cargan, parchea el formulario
    // con los objetos completos correspondientes al registro que se está editando.
    effect(() => {
      const huespedes = this.$huespedes();
      const habitaciones = this.$habitaciones();
      if (!this.data) return;

      const f = this.$form();

      if (this.auth.isAdmin() && !f.controls['huesped'].value && huespedes.length) {
        const huesped = huespedes.find((h: any) => h.dni === this.data.huespedDni);
        if (huesped) f.controls['huesped'].setValue(huesped);
      }

      if (!f.controls['habitacion'].value && habitaciones.length) {
        const detalle = this.data?.detalles?.[0];
        const numero = detalle?.habitacion?.numero ?? detalle?.habitacionNumero;
        const habId = detalle?.habitacion?.id ?? detalle?.habitacionId;
        const habitacion = habitaciones.find((h: any) => h.id === habId || h.numero === numero);
        if (habitacion) {
          f.controls['habitacion'].setValue(habitacion);
          this.$habitacionSel.set(habitacion);
        }
      }
    });
  }

  protected $f = () => this.$form().controls;
  protected estados = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA'];

  isAdmin() { return this.auth.isAdmin(); }

  onHabitacionChange(hab: any) { this.$habitacionSel.set(hab); }

  compareObj(a: any, b: any): boolean {
    return a && b ? a.id === b.id : a === b;
  }

  private fmt(d: Date | null): string {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;
    const val = form.value;
    const hab = val.habitacion;

    const ing = val.fechaIngreso as Date | null;
    const sal = val.fechaSalida as Date | null;
    let noches = 0;
    if (ing && sal) {
      const ingDate = new Date(ing.getFullYear(), ing.getMonth(), ing.getDate());
      const salDate = new Date(sal.getFullYear(), sal.getMonth(), sal.getDate());
      noches = Math.max(0, Math.round((salDate.getTime() - ingDate.getTime()) / (1000 * 60 * 60 * 24)));
    }

    if (noches <= 0) {
      this.service.setMessageChange('La fecha de salida debe ser posterior a la de ingreso');
      return;
    }

    let huespedId: number | undefined;
    if (this.auth.isAdmin()) {
      huespedId = val.huesped?.id;
    } else {
      huespedId = this.$miHuesped()?.id;
    }

    if (!huespedId) {
      this.service.setMessageChange('No se pudo identificar al huésped. Intenta recargar la página.');
      return;
    }

    const reserva: any = {
      id: val.id,
      huespedId: huespedId,
      fechaIngreso: this.fmt(val.fechaIngreso as Date),
      fechaSalida: this.fmt(val.fechaSalida as Date),
      estado: val.estado,
      observaciones: val.observaciones,
      totalPagar: (hab.precioPorNoche ?? 0) * noches,
      detalles: [{
        habitacionId: hab.id,
        cantidadNoches: noches
      }]
    };

    const isEdit = this.$isEdit();
    const op$ = isEdit ? this.service.update(reserva.id, reserva) : this.service.save(reserva);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'Reserva actualizada' : 'Reserva creada'))
    ).subscribe(() => this.close());
  }

  close() { this.dialogRef.close(); }
}