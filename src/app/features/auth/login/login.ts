import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  formLogin: FormGroup;
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formLogin = this.fb.group({
      usuarioLogin: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  iniciarSesion(): void {
    this.mensajeError = "";

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.authService.login(this.formLogin.value).subscribe({
      next: (response) => {
        this.cargando = false;

        if (response.token) {
          this.router.navigate(['/dashboard']);
        } else {
          this.mensajeError = "No se recibió un token válido.";
        }
      },
      error: (error) => {
        this.cargando = false;
        this.mensajeError =
          error?.error?.mensaje ||
          error?.error?.title ||
          "Usuario o contraseña incorrectos.";
      }
    });
  }
}