import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Reserva } from '../../model/reserva';
import { ReservaService } from '../../services/reserva.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { switchMap, tap } from 'rxjs';
import { ReservaDialogComponent } from './reserva-dialog/reserva-dialog.component';

@Component({
  selector: 'app-reserva',
  imports: [
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, RouterLink, RouterOutlet,
    MatSnackBarModule, MatDialogModule
  ],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css'
})
export class ReservaComponent {
  private readonly service = inject(ReservaService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected $dataSource = signal(new MatTableDataSource<Reserva>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $list = this.service.$listChange;
  protected displayedColumns: string[] = ['id', 'huesped', 'fechaIngreso', 'fechaSalida', 'totalPagar', 'estado', 'actions'];

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

  openDialog(reserva?: Reserva) {
    this.dialog.open(ReservaDialogComponent, { width: '700px', data: reserva });
  }

  delete(id: number) {
    if (window.confirm('¿Está seguro de eliminar esta reserva?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('ELIMINADO'))
      ).subscribe();
    }
  }
}