import { Component } from '@angular/core';
import { PeliculaCreacionDTO } from '../peliculas';
import { FormularioPeliculasComponent } from "../formulario-peliculas/formulario-peliculas.component";
import { SelectorMultipleDTO } from '../../compartidos/componentes/selector-multiple/SelectorMultipleModelo';
import { ActorAutoCompleteDTO } from '../../actores/actores';

@Component({
  selector: 'app-crear-pelicula',
  imports: [FormularioPeliculasComponent],
  templateUrl: './crear-pelicula.component.html',
  styleUrl: './crear-pelicula.component.css'
})
export class CrearPeliculaComponent {

  generosSeleccionados: SelectorMultipleDTO[] = [];
  generosNoSeleccionados: SelectorMultipleDTO[] = [
    //en futuro viene de BD
    {llave: 1, valor: 'Yuri'},
    {llave: 2, valor: 'Shonen'},
    {llave: 3, valor: 'Mecha'},
  ]

  cinesSeleccionados: SelectorMultipleDTO[] = [];
  cinesNoSeleccionados: SelectorMultipleDTO[] = [
    {llave: 1, valor: 'Akropolis'},
    {llave: 2, valor: 'Kinepolis'},
    {llave: 3, valor: 'Cinesa'},
  ]

  actoresSeleccionados: ActorAutoCompleteDTO[] = []; //estaria vacio
  
  guardarCambios(pelicula: PeliculaCreacionDTO){
    console.log('creando pelicula',pelicula);
  }






}
