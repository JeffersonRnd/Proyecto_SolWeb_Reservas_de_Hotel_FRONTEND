import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatDividerModule,
    MatInputModule, MatButtonModule, MatIconModule, MatSnackBarModule, RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  hidePassword = true;
  loading = false;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        const dest = this.auth.isAdmin() ? '/pages/tipo-habitacion' : '/pages/reserva';
        this.router.navigate([dest]);
      },
      error: () => {
        this.snack.open('Usuario o contraseña incorrectos', 'OK', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}