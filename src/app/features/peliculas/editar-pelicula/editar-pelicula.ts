import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { PeliculaService } from '../../../core/services/pelicula.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../shared/models/categoria.model';
import { ComentariosPelicula } from '../../comentarios/comentarios-pelicula/comentarios-pelicula';

@Component({
  selector: 'app-editar-pelicula',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ComentariosPelicula],
  templateUrl: './editar-pelicula.html',
  styleUrl: './editar-pelicula.css'
})
export class EditarPelicula implements OnInit {

  form!: FormGroup;
  categorias: Categoria[] = [];
  peliculaId: number = 0;
  cargando: boolean = false;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
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

    this.peliculaId = Number(this.route.snapshot.paramMap.get('id'));

    this.categoriaService.getCategorias().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : (res?.data ?? []);

        this.categorias = data
          .map((categoria: any) => ({
            ...categoria,
            id: Number(categoria.id)
          }))
          .sort((a: any, b: any) => a.id - b.id);
      }
    });

    this.cargarPelicula();
  }

  cargarPelicula(): void {
    this.peliculaService.getPeliculaById(this.peliculaId).subscribe({
      next: (res: any) => {
        const pelicula = res?.data ?? res;

        this.form.patchValue({
          titulo: pelicula.titulo,
          sinopsis: pelicula.sinopsis,
          anio: Number(pelicula.anio),
          categoriaId: Number(pelicula.categoriaId)
        });
      },
      error: async () => {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la película',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }

  actualizar(): void {
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

    this.peliculaService.actualizarPelicula(this.peliculaId, payload).subscribe({
      next: async () => {
        this.cargando = false;

        await Swal.fire({
          icon: 'success',
          title: 'Película actualizada',
          text: 'Los cambios se guardaron correctamente',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });

        this.router.navigate(['/peliculas']);
      },
      error: async () => {
        this.cargando = false;

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la película',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }
}