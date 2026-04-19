import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { PeliculaService } from '../../../core/services/pelicula.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../shared/models/categoria.model';

@Component({
  selector: 'app-crear-pelicula',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './crear-pelicula.html',
  styleUrl: './crear-pelicula.css'
})
export class CrearPelicula implements OnInit {

  form!: FormGroup;
  categorias: Categoria[] = [];
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private peliculaService: PeliculaService,
    private categoriaService: CategoriaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', Validators.required],
      sinopsis: ['', Validators.required],
      anio: [null, [Validators.required, Validators.min(1900)]],
      categoriaId: [null, Validators.required]
    });

    this.categoriaService.getCategorias().subscribe({
      next: (res) => {
        this.categorias = res;
      },
      error: async () => {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las categorías',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }

  guardar(): void {
    this.mensajeError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;

    const payload = {
      titulo: this.form.value.titulo,
      sinopsis: this.form.value.sinopsis,
      anio: Number(this.form.value.anio),
      categoriaId: Number(this.form.value.categoriaId)
    };

    this.peliculaService.crearPelicula(payload).subscribe({
      next: async () => {
        this.cargando = false;

        await Swal.fire({
          icon: 'success',
          title: 'Película creada',
          text: 'La película se registró correctamente.',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
        
        this.router.navigate(['/peliculas']);
      },
      error: async (error) => {
        this.cargando = false;
        this.mensajeError =
          error?.error?.mensaje ||
          error?.error?.title ||
          'No se pudo crear la película.';

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.mensajeError,
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }
}