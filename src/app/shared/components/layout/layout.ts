import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}