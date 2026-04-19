import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  
  usuario = {
    nombreCompleto: '',
    usuarioLogin: '',
    password: ''
  };

  private authService = inject(AuthService);

  registrar(): void {
    this.authService.registro(this.usuario).subscribe({
      next: (res) => {
        
        this.usuario = {
          nombreCompleto: '',
          usuarioLogin: '',
          password: ''
        };
        console.log('Registro exitoso y campos limpiados');
      },
      error: (err) => {
        console.error('Error al registrar:', err);
      }
    });
  }
}