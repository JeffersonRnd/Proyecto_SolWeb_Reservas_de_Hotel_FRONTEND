import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { TipoHabitacionComponent } from './pages/tipo-habitacion/tipo-habitacion.component';
import { TipoHabitacionEditComponent } from './pages/tipo-habitacion/tipo-habitacion-edit/tipo-habitacion-edit.component';
import { HabitacionComponent } from './pages/habitacion/habitacion.component';
import { HabitacionEditComponent } from './pages/habitacion/habitacion-edit/habitacion-edit.component';
import { HuespedComponent } from './pages/huesped/huesped.component';
import { HuespedEditComponent } from './pages/huesped/huesped-edit/huesped-edit.component';
import { ReservaComponent } from './pages/reserva/reserva.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'pages', component: LayoutComponent, canActivate: [authGuard],
    children: [
      {
        path: 'tipo-habitacion', component: TipoHabitacionComponent,
        children: [
          { path: 'new', component: TipoHabitacionEditComponent, canActivate: [adminGuard] },
          { path: 'edit/:id', component: TipoHabitacionEditComponent, canActivate: [adminGuard] }
        ]
      },
      {
        path: 'habitacion', component: HabitacionComponent,
        children: [
          { path: 'new', component: HabitacionEditComponent, canActivate: [adminGuard] },
          { path: 'edit/:id', component: HabitacionEditComponent, canActivate: [adminGuard] }
        ]
      },
      {
        path: 'huesped', component: HuespedComponent, canActivate: [adminGuard],
        children: [
          { path: 'new', component: HuespedEditComponent },
          { path: 'edit/:id', component: HuespedEditComponent }
        ]
      },
      { path: 'reserva', component: ReservaComponent },
      { path: '', redirectTo: 'reserva', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];