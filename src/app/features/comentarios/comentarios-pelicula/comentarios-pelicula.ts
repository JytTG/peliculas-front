import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ComentarioService } from '../../../core/services/comentario.service';
import { Comentario } from '../../../shared/models/comentario.model';

@Component({
  selector: 'app-comentarios-pelicula',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './comentarios-pelicula.html',
  styleUrl: './comentarios-pelicula.css'
})
export class ComentariosPelicula implements OnChanges {

  @Input() peliculaId: number = 0;

  comentarios: Comentario[] = [];
  formComentario: FormGroup;
  cargando: boolean = false;
  guardando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private comentarioService: ComentarioService
  ) {
    this.formComentario = this.fb.group({
      texto: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['peliculaId'] && this.peliculaId > 0) {
      this.obtenerComentarios();
    }
  }

  obtenerComentarios(): void {
    this.cargando = true;

    this.comentarioService.getComentariosPorPelicula(Number(this.peliculaId)).subscribe({
      next: (response: any) => {
        const data = Array.isArray(response) ? response : (response?.data ?? []);

        this.comentarios = data
          .map((comentario: any) => ({
            ...comentario,
            id: Number(comentario.id),
            peliculaId: Number(comentario.peliculaId),
            usuarioId: Number(comentario.usuarioId)
          }))
          .sort((a: any, b: any) =>
            new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
          );

        this.cargando = false;
      },
      error: async () => {
        this.cargando = false;

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los comentarios.',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }

  guardarComentario(): void {
    if (this.formComentario.invalid || this.peliculaId <= 0) {
      this.formComentario.markAllAsTouched();
      return;
    }

    this.guardando = true;

    const payload = {
      texto: this.formComentario.value.texto?.trim(),
      peliculaId: Number(this.peliculaId)
    };

    this.comentarioService.crearComentario(payload).subscribe({
      next: async (response: any) => {
        const nuevoComentario = {
          ...response,
          id: Number(response.id),
          peliculaId: Number(response.peliculaId),
          usuarioId: Number(response.usuarioId)
        };

        this.comentarios = [nuevoComentario, ...this.comentarios].sort(
          (a: any, b: any) =>
            new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );

        this.formComentario.reset();
        this.guardando = false;

        await Swal.fire({
          icon: 'success',
          title: 'Comentario agregado',
          text: 'El comentario se registró correctamente.',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      },
      error: async () => {
        this.guardando = false;

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el comentario.',
          background: '#111827',
          color: '#ffffff',
          confirmButtonColor: '#e50914'
        });
      }
    });
  }
}