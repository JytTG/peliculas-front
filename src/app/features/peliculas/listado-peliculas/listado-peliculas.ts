import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { PeliculaService } from '../../../core/services/pelicula.service';
import { Pelicula } from '../../../shared/models/pelicula.model';

@Component({
  selector: 'app-listado-peliculas',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './listado-peliculas.html',
  styleUrl: './listado-peliculas.css'
})
export class ListadoPeliculas implements OnInit {

  peliculas: Pelicula[] = [];

  constructor(
    private peliculaService: PeliculaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerPeliculas();
  }

  obtenerPeliculas(): void {
    this.peliculaService.getPeliculas().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res?.data ?? []);

        this.peliculas = data
          .map((pelicula: any) => ({
            ...pelicula,
            id: Number(pelicula.id),
            categoriaId: pelicula.categoriaId != null ? Number(pelicula.categoriaId) : null
          }))
          .sort((a: any, b: any) => a.id - b.id);

        this.cdr.detectChanges();
      },
      error: async () => {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo obtener el listado de películas',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }

  editar(id: number): void {
    this.router.navigate(['/peliculas/editar', Number(id)]);
  }

  async eliminar(id: number): Promise<void> {
    const idEliminar = Number(id);

    const r = await Swal.fire({
      title: '¿Eliminar película?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      background: '#111827',
      color: '#ffffff',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#374151'
    });

    if (!r.isConfirmed) return;

    this.peliculaService.eliminarPelicula(idEliminar).subscribe({
      next: async () => {
        this.peliculas = this.peliculas
          .filter(p => Number(p.id) !== idEliminar)
          .sort((a: any, b: any) => a.id - b.id);
          
        this.peliculas = [...this.peliculas];
        this.cdr.detectChanges();

        await Swal.fire({
          icon: 'success',
          title: 'Película eliminada',
          text: 'La película se eliminó correctamente.',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      },
      error: async () => {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la película',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }
}