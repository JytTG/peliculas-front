import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CategoriaService } from './../../../core/services/categoria.service';

@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-categoria.html',
  styleUrl: './crear-categoria.css'
})
export class CrearCategoria {

  formCategoria: FormGroup;
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router
  ) {
    this.formCategoria = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  guardarCategoria(): void {
    this.mensajeError = '';

    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }

    this.cargando = true;

    this.categoriaService.crearCategoria(this.formCategoria.value).subscribe({
      next: async () => {
        this.cargando = false;

        await Swal.fire({
          icon: 'success',
          title: 'Categoría creada',
          text: 'La categoría se registró correctamente.',
          confirmButtonText: 'Aceptar',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });

        this.router.navigate(['/categorias']);
      },
      error: async (error) => {
        this.cargando = false;
        this.mensajeError = error?.error?.mensaje || 'Error al crear categoría.';

        await Swal.fire({
          icon: 'error',
          title: 'No se pudo crear',
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