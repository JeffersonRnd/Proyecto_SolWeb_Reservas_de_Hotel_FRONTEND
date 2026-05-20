import { Routes } from '@angular/router';
import { TipoHabitacionComponent } from './pages/tipo-habitacion/tipo-habitacion.component';
import { TipoHabitacionEditComponent } from './pages/tipo-habitacion/tipo-habitacion-edit/tipo-habitacion-edit.component';
import { HabitacionComponent } from './pages/habitacion/habitacion.component';
import { HabitacionEditComponent } from './pages/habitacion/habitacion-edit/habitacion-edit.component';
import { HuespedComponent } from './pages/huesped/huesped.component';
import { HuespedEditComponent } from './pages/huesped/huesped-edit/huesped-edit.component';
import { ReservaComponent } from './pages/reserva/reserva.component';

export const routes: Routes = [
    {
        path: 'pages/tipo-habitacion', component: TipoHabitacionComponent,
        children: [
            { path: 'new', component: TipoHabitacionEditComponent },
            { path: 'edit/:id', component: TipoHabitacionEditComponent }
        ]
    },
    {
        path: 'pages/habitacion', component: HabitacionComponent,
        children: [
            { path: 'new', component: HabitacionEditComponent },
            { path: 'edit/:id', component: HabitacionEditComponent }
        ]
    },
    {
        path: 'pages/huesped', component: HuespedComponent,
        children: [
            { path: 'new', component: HuespedEditComponent },
            { path: 'edit/:id', component: HuespedEditComponent }
        ]
    },
    { path: 'pages/reserva', component: ReservaComponent },
    { path: '', redirectTo: 'pages/tipo-habitacion', pathMatch: 'full' }
];
