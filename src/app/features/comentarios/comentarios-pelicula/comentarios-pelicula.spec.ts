import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComentariosPelicula } from './comentarios-pelicula';

describe('ComentariosPelicula', () => {
  let component: ComentariosPelicula;
  let fixture: ComponentFixture<ComentariosPelicula>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComentariosPelicula],
    }).compileComponents();

    fixture = TestBed.createComponent(ComentariosPelicula);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
