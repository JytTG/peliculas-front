import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CategoriaService } from './../../../core/services/categoria.service';
import { Categoria } from './../../../shared/models/categoria.model';

@Component({
  selector: 'app-listado-categorias',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './listado-categorias.html',
  styleUrl: './listado-categorias.css'
})
export class ListadoCategorias implements OnInit {

  categorias: Categoria[] = [];
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.categoriaService.getCategorias().subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data ?? []);

        this.categorias = data
          .map((categoria: any) => ({
            ...categoria,
            id: Number(categoria.id)
          }))
          .sort((a: any, b: any) => a.id - b.id);

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: async (error) => {
        this.cargando = false;
        this.mensajeError = error?.error?.mensaje || 'Error al obtener categorías.';

        await Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar',
          text: this.mensajeError,
          confirmButtonText: 'Aceptar',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }

  editarCategoria(id: number): void {
    this.router.navigate(['/categorias/editar', id]);
  }

  async eliminarCategoria(id: number): Promise<void> {
    const resultado = await Swal.fire({
      title: '¿Eliminar categoría?',
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

    if (!resultado.isConfirmed) return;

    const idEliminar = Number(id);

    this.categoriaService.eliminarCategoria(idEliminar).subscribe({
      next: async () => {
        this.categorias = this.categorias.filter(
          categoria => Number(categoria.id) !== idEliminar
        );

        this.categorias = [...this.categorias];
        this.cdr.detectChanges();

        await Swal.fire({
          icon: 'success',
          title: 'Categoría eliminada',
          text: 'La categoría se eliminó correctamente.',
          confirmButtonText: 'Aceptar',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      },
      error: async (error) => {
        this.mensajeError = error?.error?.mensaje || 'Error al eliminar categoría.';
      
      await Swal.fire({
          icon: 'error',
          title: 'No se pudo eliminar',
          text: this.mensajeError,
          confirmButtonText: 'Aceptar',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }
}