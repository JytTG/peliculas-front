import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoriaService } from './../../../core/services/categoria.service';

@Component({
  selector: 'app-editar-categoria',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './editar-categoria.html',
  styleUrl: './editar-categoria.css'
})
export class EditarCategoria implements OnInit {

  formCategoria: FormGroup;
  mensajeError: string = '';
  cargando: boolean = false;
  categoriaId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router
  ) {
    this.formCategoria = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoriaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarCategoria();
  }

  cargarCategoria(): void {
    this.categoriaService.getCategoriaById(this.categoriaId).subscribe({
      next: (response) => {
        this.formCategoria.patchValue({
          nombre: response.nombre,
          descripcion: response.descripcion
        });
      },
      error: async (error) => {
        this.mensajeError = error?.error?.mensaje || 'Error al cargar categoría.';

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

  actualizarCategoria(): void {
    this.mensajeError = '';

    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.categoriaService.actualizarCategoria(this.categoriaId, this.formCategoria.value).subscribe({
      next: async () => {
        this.cargando = false;

        await Swal.fire({
          icon: 'success',
          title: 'Categoría actualizada',
          text: 'Los cambios se guardaron correctamente.',
          confirmButtonText: 'Aceptar',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });

        this.router.navigate(['/categorias']);
      },
      error: async (error) => {
        this.cargando = false;
        this.mensajeError = error?.error?.mensaje || 'Error al actualizar categoría.';

        await Swal.fire({
          icon: 'error',
          title: 'No se pudo actualizar',
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