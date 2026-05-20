import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HuespedService } from '../../../services/huesped.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Huesped } from '../../../model/huesped';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-huesped-edit',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './huesped-edit.component.html',
  styleUrl: './huesped-edit.component.css'
})
export class HuespedEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(HuespedService);

  protected $form = signal(new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    apellido: new FormControl<string>('', [Validators.required, Validators.minLength(2)]),
    dni: new FormControl<string>('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    correo: new FormControl<string>('', [Validators.required, Validators.email]),
    telefono: new FormControl<string>(''),
    direccion: new FormControl<string>('')
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

  operate() {
    const form = this.$form();
    if (form.invalid) return;
    const obj: Huesped = form.value as Huesped;
    const isEdit = this.$isEdit();
    const op$ = isEdit ? this.service.update(this.$id(), obj) : this.service.save(obj);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'ACTUALIZADO' : 'CREADO'))
    ).subscribe(() => this.router.navigate(['/pages/huesped']));
  }
}