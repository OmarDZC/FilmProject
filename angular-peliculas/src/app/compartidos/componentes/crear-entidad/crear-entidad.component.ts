import { AfterViewInit, Component, ComponentRef, inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { SERVICIO_CRUD_TOKEN } from '../../proveedores/proveedores';
import { IServicioCRUD } from '../../interfaces/IServicioCRUD';
import { Router } from '@angular/router';
import { extraerErrores } from '../../funciones/extraerErrores';
import { MostrarErroresComponent } from "../mostrar-errores/mostrar-errores.component";
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-crear-entidad',
  imports: [MostrarErroresComponent, CdkDragPlaceholder],
  templateUrl: './crear-entidad.component.html',
  styleUrl: './crear-entidad.component.css'
})
export class CrearEntidadComponent <TDTO, TCreacionDTO> implements AfterViewInit{
  ngAfterViewInit(): void {
    this.componentRef = this.contenedorFormulario.createComponent(this.formulario); //crear un componente que se guarda en la variable
    this.componentRef.instance.posteoFormulario.subscribe((entidad: any) => {
      this.guardarCambios(entidad);
    })
  }

  @Input({required:true})
  titulo!: string;

  @Input({required:true})
  rutaIndice!: string;

  @Input({required:true})
  formulario: any;

  errores: string[] = [];

  serviocCRUD = inject(SERVICIO_CRUD_TOKEN) as IServicioCRUD<TDTO, TCreacionDTO>;
  router = inject(Router);

  @ViewChild('contenedorFormulario', {read: ViewContainerRef})
  contenedorFormulario!: ViewContainerRef; //coge referencia del view y lo pone en variable  

  private componentRef!: ComponentRef<any>;

  guardarCambios(entidad : TCreacionDTO){
    this.serviocCRUD.crear(entidad).subscribe({
      //next si es exitoso
      next: () => {
        this.router.navigate([this.rutaIndice]);
      },
      //si hay error
      error: err => {
        const errores = extraerErrores(err);
        this.errores = errores;
        console.log("error completo: ", err);
        console.log("errores recibidos: ", this.errores);
      }
    });
  }






}
