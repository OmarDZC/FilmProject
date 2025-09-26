import { Component, Input, numberAttribute } from '@angular/core';
import { CineCreacionDTO, CineDTO } from '../cines';
import { FormularioCinesComponent } from "../formulario-cines/formulario-cines.component";

@Component({
  selector: 'app-editar-cine',
  imports: [FormularioCinesComponent],
  templateUrl: './editar-cine.component.html',
  styleUrl: './editar-cine.component.css'
})
export class EditarCineComponent {

  @Input({transform: numberAttribute})
  id!: number;
  
  cine: CineDTO = {id: 1, nombre: 'Acrópolis', latitud: 40.29785730846585, longitud: -3.780213080384748}

  

  guardarCambios(cine: CineCreacionDTO){
    console.log('editando el cine',cine)
  }

}
