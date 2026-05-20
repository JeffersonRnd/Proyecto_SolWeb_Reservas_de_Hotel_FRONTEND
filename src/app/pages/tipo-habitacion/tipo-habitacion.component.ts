import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { TipoHabitacion } from '../../model/tipo-habitacion';
import { TipoHabitacionService } from '../../services/tipo-habitacion.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-tipo-habitacion',
  imports: [
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, RouterLink, RouterOutlet, MatSnackBarModule
  ],
  templateUrl: './tipo-habitacion.component.html',
  styleUrl: './tipo-habitacion.component.css'
})
export class TipoHabitacionComponent {
  private readonly service = inject(TipoHabitacionService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<TipoHabitacion>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $list = this.service.$listChange;
  protected displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];

  constructor() {
    this.service.findAll().subscribe(data => this.service.setListChange(data));
    effect(() => {
      const ds = this.$dataSource();
      ds.data = this.$list();
      ds.paginator = this.$paginator();
      ds.sort = this.$sort();
    });
    effect(() => {
      const msg = this.service.$messageChange();
      if (msg) {
        this.snackBar.open(msg, 'OK', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.service.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.$dataSource().filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    if (window.confirm('¿Está seguro de eliminar?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('ELIMINADO'))
      ).subscribe();
    }
  }
}