import { Component, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActorCreacionDTO, ActorDTO } from '../actores';
import moment from 'moment';
import { fechaNoPuedeSerFuturo } from '../../compartidos/funciones/validaciones';
import { InputImgComponent } from "../../compartidos/componentes/input-img/input-img.component";

@Component({
  selector: 'app-formulario-actores',
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, InputImgComponent],
  templateUrl: './formulario-actores.component.html',
  styleUrl: './formulario-actores.component.css'
})
export class FormularioActoresComponent implements OnInit {
  ngOnInit(): void {
    if(this.modelo !== undefined){
      this.form.patchValue(this.modelo);
    }
  }

  @Input()
  modelo?: ActorDTO;
  
  @Output()
  posteoFormulario = new EventEmitter<ActorCreacionDTO>(); //empujar hacia el componente padre

  private formBuilder =  inject(FormBuilder);

  //construir formulario
  form = this.formBuilder.group({
    nombre: ['', {
      validators: [Validators.required] //es requerido
    }],
    //puede ser nulo, y validacion de no ser fecha futura
    fechaNacimiento: new FormControl<Date | null>(null, {
      validators: [Validators.required, fechaNoPuedeSerFuturo()]
    }),
    //se añade foto en el formulario
    foto: new FormControl<File | string | null>(null)
  })

  obtenerErrorCampoNombre() {
    let campo = this.form.controls.nombre;
    if(campo.hasError('required')){
      return 'El campo nombre es requerido'
    }
    return "";
  }

  obtenerErrorCampoFecha() {
    let fecha = this.form.controls.fechaNacimiento;
    if(fecha.hasError('required')){
      return 'El campo fecha es requerido'
    }
    if(fecha.hasError('futuro')){
      return fecha.getError('futuro').mensaje;
    }
    return "";
  }

  archivoSeleccionado(file: File) {
    this.form.controls.foto.setValue(file);
  }

  guardarCambios(){
    if(!this.form.valid){
      return;
    }
    const actor = this.form.value as ActorCreacionDTO;
    actor.fechaNacimiento = moment(actor.fechaNacimiento).toDate();

    if(typeof actor.foto === "string"){
      actor.foto = undefined; //la foto es un string (url) si el valor es url sera undefined para que NO se guarde 2 veces en el back
    }
    this.posteoFormulario.emit(actor);
  } 
  
}
