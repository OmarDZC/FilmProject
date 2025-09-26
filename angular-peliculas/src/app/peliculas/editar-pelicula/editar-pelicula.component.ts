import { Component, Input, numberAttribute } from '@angular/core';
import { PeliculaCreacionDTO, PeliculaDTO } from '../peliculas';
import { FormularioPeliculasComponent } from "../formulario-peliculas/formulario-peliculas.component";
import { SelectorMultipleDTO } from '../../compartidos/componentes/selector-multiple/SelectorMultipleModelo';
import { ActorAutoCompleteDTO } from '../../actores/actores';

@Component({
  selector: 'app-editar-pelicula',
  imports: [FormularioPeliculasComponent],
  templateUrl: './editar-pelicula.component.html',
  styleUrl: './editar-pelicula.component.css'
})
export class EditarPeliculaComponent {

  @Input({ transform: numberAttribute })
  id!: number;

  pelicula: PeliculaDTO = {
    id: 1, titulo: 'Pokemon', trailer: 'ABC',
    fechaLanzamiento: new Date('2018-07-25'), poster: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/250px-International_Pok%C3%A9mon_logo.svg.png'
  }

  generosSeleccionados: SelectorMultipleDTO[] = [
    { llave: 2, valor: 'Shonen' } //para que haya un por defecto
  ];
  generosNoSeleccionados: SelectorMultipleDTO[] = [
    //en futuro viene de BD
    { llave: 1, valor: 'Yuri' },
    { llave: 3, valor: 'Mecha' },
  ]

  cinesSeleccionados: SelectorMultipleDTO[] = [
    {llave: 3, valor: 'Cinesa'}
  ];

  cinesNoSeleccionados: SelectorMultipleDTO[] = [
    {llave: 1, valor: 'Akropolis'},
    {llave: 2, valor: 'Kinepolis'},
  ]

  actoresSeleccionados: ActorAutoCompleteDTO[] = [
    { id: 1, nombre: "Tanjiro", personaje: 'Tanjiro Kamado', foto: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Tanjirou_manga.png/250px-Tanjirou_manga.png'},
  ]



  guardarCambios(pelicula: PeliculaCreacionDTO) {
    console.log('editando pelicula', pelicula);
  }


}
