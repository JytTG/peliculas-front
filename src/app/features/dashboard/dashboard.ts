import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PeliculaService } from '../../core/services/pelicula.service';
import { Pelicula } from '../../shared/models/pelicula.model';

interface PeliculaDashboard extends Pelicula {
  posterUrl: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  peliculasDestacadas: PeliculaDashboard[] = [];
  cargandoPeliculas: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private peliculaService: PeliculaService
  ) {}

  ngOnInit(): void {
    this.obtenerPeliculasDestacadas();
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private obtenerPeliculasDestacadas(): void {
    this.cargandoPeliculas = true;

    this.peliculaService.getPeliculas().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res?.data ?? []);

        const peliculasOrdenadas = data
          .map((pelicula: any) => ({
            ...pelicula,
            id: Number(pelicula.id),
            anio: Number(pelicula.anio),
            categoriaId: pelicula.categoriaId != null ? Number(pelicula.categoriaId) : null
          }))
          .sort((a: any, b: any) => a.id - b.id)
          .slice(0, 5);

        this.peliculasDestacadas = peliculasOrdenadas.map((pelicula: Pelicula, index: number) => ({
          ...pelicula,
          posterUrl: this.crearPosterSvg(
            pelicula.titulo,
            pelicula.categoriaNombre || 'Película',
            pelicula.anio,
            index
          )
        }));

        this.cargandoPeliculas = false;
      },
      error: () => {
        this.peliculasDestacadas = [];
        this.cargandoPeliculas = false;
      }
    });
  }

  private crearPosterSvg(titulo: string, categoria: string, anio: number, index: number): string {

    const fondos = [
      { a: '#0f172a', b: '#7f1d1d', c: '#e50914' },
      { a: '#111827', b: '#1e3a8a', c: '#ef4444' },
      { a: '#1f2937', b: '#7c2d12', c: '#dc2626' },
      { a: '#0b1120', b: '#4c1d95', c: '#f43f5e' },
      { a: '#111827', b: '#14532d', c: '#f97316' }
    ];

    const fondo = fondos[index % fondos.length];

    const tituloSeguro = this.escaparXml((titulo || 'PELÍCULA').toUpperCase());
    const categoriaSeguro = this.escaparXml(categoria || 'Película');
    const anioSeguro = this.escaparXml(String(anio || ''));

    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="740" viewBox="0 0 500 740">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${fondo.a}" />
      <stop offset="55%" stop-color="${fondo.b}" />
      <stop offset="100%" stop-color="${fondo.c}" />
    </linearGradient>

    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </linearGradient>
  </defs>

  <rect width="500" height="740" rx="30" fill="url(#bg)" />
  <rect x="18" y="18" width="464" height="704" rx="22" fill="none" stroke="rgba(255,255,255,0.15)" />

  <circle cx="430" cy="130" r="120" fill="rgba(255,255,255,0.08)" />
  <circle cx="105" cy="600" r="95" fill="rgba(255,255,255,0.06)" />

  <rect x="50" y="80" width="250" height="740" fill="url(#shine)" transform="rotate(8 0 0)" />

  <text x="40" y="85" fill="#ffffff" font-size="22" font-family="Arial, Helvetica, sans-serif" font-weight="700" opacity="0.92">
    PeliFlix
  </text>

  <text x="40" y="140" fill="#fecaca" font-size="18" font-family="Arial, Helvetica, sans-serif" font-weight="700" letter-spacing="2">
    CARTELERA
  </text>

  <foreignObject x="35" y="185" width="420" height="220">
    <div xmlns="http://www.w3.org/1999/xhtml"
         style="color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:42px;font-weight:800;line-height:1.08;">
      ${tituloSeguro}
    </div>
  </foreignObject>

  <text x="40" y="520" fill="#f3f4f6" font-size="26" font-family="Arial, Helvetica, sans-serif" font-weight="700">
    ${categoriaSeguro}
  </text>

  <text x="40" y="565" fill="#e5e7eb" font-size="22" font-family="Arial, Helvetica, sans-serif">
    Año ${anioSeguro}
  </text>

  <rect x="40" y="615" width="180" height="42" rx="12" fill="rgba(0,0,0,0.28)" stroke="rgba(255,255,255,0.10)" />

  <text x="62" y="642" fill="#ffffff" font-size="20" font-family="Arial, Helvetica, sans-serif" font-weight="700">
    ID ${index + 1}
  </text>
</svg>
`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  private escaparXml(valor: string): string {
    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}