import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HabitacionService } from '../../../services/habitacion.service';
import { TipoHabitacionService } from '../../../services/tipo-habitacion.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Habitacion } from '../../../model/habitacion';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-habitacion-edit',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './habitacion-edit.component.html',
  styleUrl: './habitacion-edit.component.css'
})
export class HabitacionEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(HabitacionService);
  private readonly tipoService = inject(TipoHabitacionService);

  protected $tipos = toSignal(this.tipoService.findAll(), { initialValue: [] });

  protected $form = signal(new FormGroup({
    id: new FormControl<number | null>(null),
    numero: new FormControl<string>('', [Validators.required]),
    tipoHabitacion: new FormControl<any>(null, [Validators.required]),
    precioPorNoche: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    capacidad: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    servicios: new FormControl<string>(''),
    disponible: new FormControl<boolean>(true)
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());
  protected $f = computed(() => this.$form().controls);

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareTipo(a: any, b: any): boolean {
    return a && b ? a.id === b.id : a === b;
  }

  operate() {
    const form = this.$form();
    if (form.invalid) return;
    const obj: Habitacion = form.value as Habitacion;
    const isEdit = this.$isEdit();
    const op$ = isEdit ? this.service.update(this.$id(), obj) : this.service.save(obj);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    ).subscribe(() => this.router.navigate(['/pages/habitacion']));
  }
}