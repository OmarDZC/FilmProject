import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { primeraLetraMayuscula } from '../../compartidos/funciones/validaciones';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { GeneroCreacionDTO, GeneroDTO } from '../generos';

@Component({
  selector: 'app-formulario-genero',
  imports: [MatButtonModule, RouterLink, MatFormFieldModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './formulario-genero.component.html',
  styleUrl: './formulario-genero.component.css'
})
export class FormularioGeneroComponent implements OnInit{
  //se necesita onInit para verificar si el modelo es null y si no es injectar el valor
  ngOnInit(): void {
    if(this.modelo !== undefined) {
      this.form.patchValue(this.modelo);
    }
  }

  @Input()
  modelo: GeneroDTO | undefined
  //modelo?: GeneroDTO // => seria lo mismo

  @Output()
  posteoFormulario = new EventEmitter<GeneroCreacionDTO>(); //hace que el componente hijo emita al componente padre

  //formulario reactivo
  private formbuilder = inject(FormBuilder);

  form = this.formbuilder.group({
    //campos del formulario
    nombre: ['', { validators: [Validators.required, primeraLetraMayuscula(), Validators.maxLength(20)] }] //se podria colocar la funcion validadora que hicimos
  })

  obtenerErrorCampoNombre(): string {
    let nombre = this.form.controls.nombre; //obtengo acceso al campo (NO AL VALOR)
    if (nombre.hasError('required')) {
      return "El campo nombre es requerido"
    }
    //para poner la validacion sin necesidad de que llegue a la api
    if (nombre.hasError('maxlength')) {
      return `El campo nombre no puede tener más de ${nombre.getError('maxlength').requiredLength} caracteres`
    }

    if (nombre.hasError('primeraLetraMayuscula')) {
      return nombre.getError('primeraLetraMayuscula').mensaje; //el mensaje que pusimos en la validacion
    }

    //si no tiene errores..
    return ""
  }

  guardarCambios(){
    if(!this.form.valid){
      return;
    }

    const genero = this.form.value as GeneroCreacionDTO; //tratar como si fuera de tipo GeneroCreacionDTO
    this.posteoFormulario.emit(genero); //emite el evento
  }
  
}
