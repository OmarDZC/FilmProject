import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ActorAutoCompleteDTO } from '../actores';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-autocomplete-actores',
  imports: [MatAutocompleteModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, FormsModule, MatTableModule, MatInputModule, DragDropModule],
  templateUrl: './autocomplete-actores.component.html',
  styleUrl: './autocomplete-actores.component.css'
})
export class AutocompleteActoresComponent {

  control = new FormControl();

  actores: ActorAutoCompleteDTO[] = [{
    id: 1, nombre: "Tanjiro", personaje: '', foto: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Tanjirou_manga.png/250px-Tanjirou_manga.png'
  },
  { id: 2, nombre: 'Ash', personaje: '', foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Ash_Ketchum_%285764005330%29.jpg/250px-Ash_Ketchum_%285764005330%29.jpg' },
  { id: 3, nombre: 'Naruto', personaje: '', foto: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Cosplay_-_AWA15_-_Naruto_Uzumaki_derivate.png/250px-Cosplay_-_AWA15_-_Naruto_Uzumaki_derivate.png' }
  ]

  @Input({required: true})
  actoresSeleccionados: ActorAutoCompleteDTO[] = [];

  columnasAMostrar = ['imagen', 'nombre', 'personaje', 'acciones']; //acciones => deseleccionar... 

  //referencia de un elemento HTML o que este siendo utilizado => table
  @ViewChild(MatTable) table!: MatTable<ActorAutoCompleteDTO>;


  actorSeleccionado(event: MatAutocompleteSelectedEvent) {
    this.actoresSeleccionados.push(event.option.value); //para añadir el actor
    this.control.patchValue(''); //para que cuando añada un personaje no se ponga object object

    //y con esto podemos seleccionar varios
    if (this.table != undefined) {
      this.table.renderRows();
    }
  }

  finalizarArrastre(event: CdkDragDrop<any[]>){
    //mover los actoresSeleccionados entre si
    const indicePrevio = this.actoresSeleccionados.findIndex(actor => actor === event.item.data); //buscar el indice anterior
    //funcion de material para mover elementos en un []
    moveItemInArray(this.actoresSeleccionados, indicePrevio, event.currentIndex); //event.currenIndex => index actual
    this.table.renderRows();
  }

  //funcionar para eliminar acciones
  eliminar(actor: ActorAutoCompleteDTO) {
    const indice = this.actoresSeleccionados.findIndex((a: ActorAutoCompleteDTO) => a.id === actor.id);
    this.actoresSeleccionados.splice(indice, 1);
    this.table.renderRows();
  }

}
