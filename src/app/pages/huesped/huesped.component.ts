import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Huesped } from '../../model/huesped';
import { HuespedService } from '../../services/huesped.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-huesped',
  imports: [
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, MatTooltipModule, RouterLink, RouterOutlet, MatSnackBarModule
  ],
  templateUrl: './huesped.component.html',
  styleUrl: './huesped.component.css'
})
export class HuespedComponent {
  private readonly service = inject(HuespedService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Huesped>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $list = this.service.$listChange;
  protected displayedColumns = ['id', 'nombre', 'apellido', 'dni', 'correo', 'telefono', 'actions'];

  constructor() {
    this.service.findAll().subscribe(data => this.service.setListChange(data));
    effect(() => {
      const ds = this.$dataSource();
      ds.data = this.$list();
      ds.paginator = this.$paginator() ?? null;
      ds.sort = this.$sort() ?? null;
    });
    effect(() => {
      const msg = this.service.$messageChange();
      if (msg) {
        this.snackBar.open(msg, 'OK', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.service.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) { this.$dataSource().filter = e.target.value.trim().toLowerCase(); }

  delete(id: number) {
    if (window.confirm('¿Eliminar este huésped?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('Huésped eliminado'))
      ).subscribe();
    }
  }
}