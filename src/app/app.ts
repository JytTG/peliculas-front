import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './shared/components/layout/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'peliculas-front';
}
