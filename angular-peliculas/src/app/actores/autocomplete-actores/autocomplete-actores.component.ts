import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ActorAutoCompleteDTO } from '../actores';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActoresService } from '../actores.service';


@Component({
  selector: 'app-autocomplete-actores',
  imports: [MatAutocompleteModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, FormsModule, MatTableModule, MatInputModule, DragDropModule],
  templateUrl: './autocomplete-actores.component.html',
  styleUrl: './autocomplete-actores.component.css'
})
export class AutocompleteActoresComponent implements OnInit{
  ngOnInit(): void {
    this.control.valueChanges.subscribe(valor => {
      //cada vez que se escriba en el input busque un nombre
      if(typeof valor === 'string' && valor) {
        this.actoresService.obtenerPorNombre(valor).subscribe(actores => {
          this.actores = actores;
        })
      }
    })
  }

  control = new FormControl();
  actores: ActorAutoCompleteDTO[] = [];
  actoresService = inject(ActoresService);

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
