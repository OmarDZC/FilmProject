import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatIconModule, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit{
  
  ngOnInit(): void {
    this.ratingAnterior = this.ratingSeleccionado;
  }

  @Input({required: true, transform: (valor: number) => Array(valor).fill(0)}) //transforma number y lo hace []
  maximoRating!: number[]; //numero de estrellas como maximo haya

  @Input() //valores de entrada
  ratingSeleccionado = 0; //para cuando el usuario puntua

  @Output() //valores de salida
  votado = new EventEmitter<number>();
  
  ratingAnterior = 0; //cuando el usuario haga click se le cambia el valor

  manejarMouseEnter(indice: number){
    this.ratingSeleccionado = indice + 1; //el indice empieza por 0
  }

  manejarMouseLeave(){
    if(this.ratingAnterior !== 0){
      //ya selecciono, si se quita el mouse queremos que vuelva al anterior
      this.ratingSeleccionado = this.ratingAnterior;
    }else {
      //si no se realizo puntuacion
      this.ratingSeleccionado = 0;
    }
  }
  
  manejarClick(indice: number){
    this.ratingSeleccionado = indice + 1;
    this.ratingAnterior = this.ratingSeleccionado; //para que cuando pulse se le dara el valor al seleccionado
    this.votado.emit(this.ratingSeleccionado); //emit => emitir, levantar el evento
  }

}
