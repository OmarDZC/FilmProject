import { Component, Input } from '@angular/core';
import { SelectorMultipleDTO } from './SelectorMultipleModelo';

@Component({
  selector: 'app-selector-multiple',
  imports: [],
  templateUrl: './selector-multiple.component.html',
  styleUrl: './selector-multiple.component.css'
})
export class SelectorMultipleComponent {

  //estará listado de seleccionados y los no seleccionados
  @Input({required: true})
  Seleccionados!: SelectorMultipleDTO[];

  @Input({required: true})
  NoSeleccionados!: SelectorMultipleDTO[];

  seleccionar(elemento: SelectorMultipleDTO, indice: number){
    this.Seleccionados.push(elemento);
    this.NoSeleccionados.splice(indice, 1); //solo borrar 1
  }

  deseleccionar(elemento: SelectorMultipleDTO, indice: number){
    this.NoSeleccionados.push(elemento);
    this.Seleccionados.splice(indice, 1);
  }

  seleccionarTodo(){
    this.Seleccionados.push(... this.NoSeleccionados);
    this.NoSeleccionados.length = 0; //limpiar un []
  }

  deseleccionarTodo(){
    this.NoSeleccionados.push(...this.Seleccionados);
    this.Seleccionados.length = 0;
  }




}
