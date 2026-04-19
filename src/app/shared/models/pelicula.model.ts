export interface Pelicula {
  id: number;
  titulo: string;
  sinopsis: string;
  anio: number;
  categoriaId: number;
  categoriaNombre?: string;
}