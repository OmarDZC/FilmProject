import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select';
import { ListadoPeliculasComponent } from "../listado-peliculas/listado-peliculas.component";
import { FiltroPeliculas } from './filtroPelicula';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GeneroDTO } from '../../generos/generos';
import { PeliculaDTO } from '../peliculas';
import { GenerosService } from '../../generos/generos.service';
import { PeliculasService } from '../peliculas.service';
import { PaginacionDTO } from '../../compartidos/modelo/PaginacionDTO';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs';



@Component({
  selector: 'app-filtro-peliculas',
  imports: [MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,
    MatSelectModule, MatCheckboxModule, ListadoPeliculasComponent, MatPaginatorModule],
  templateUrl: './filtro-peliculas.component.html',
  styleUrl: './filtro-peliculas.component.css'
})
export class FiltroPeliculasComponent implements OnInit {

  generosService = inject(GenerosService);
  peliculasService = inject(PeliculasService);
  paginacion: PaginacionDTO = { pagina: 1, recordPorPagina: 10 };
  cantidadTotalRegistros!: number;

  ngOnInit(): void {

    this.generosService.obtenerTodos().subscribe(generos => {
      this.generos = generos;
      this.leerValoresUrl();
      this.buscarPeliculas(this.form.value as FiltroPeliculas); //si yo modifico formulario a traves de actualizar la url, queremos los filtros a traves de aqui

      this.form.valueChanges
      .pipe(
        //una espera para que coja lo ultimo escrito en ese tiempo es decir.. "titulo: xxxxx..."
        debounceTime(300) //NO sobrecarga la BD y es mas eficiente
      )
      .subscribe(valores => {
        this.buscarPeliculas(valores as FiltroPeliculas);
        this.escribirParametrosBusquedaEnUrl(valores as FiltroPeliculas);
      })
    })
  }

  //funcion para buscar las peliculas
  buscarPeliculas(valores: FiltroPeliculas) {
    valores.pagina = this.paginacion.pagina;
    valores.recordsPorPagina = this.paginacion.recordPorPagina;

    this.peliculasService.filtrar(valores).subscribe(respuesta => {
      this.peliculas = respuesta.body as PeliculaDTO[];
      const cabecera = respuesta.headers.get('cantidad-total-registros') as string;
      this.cantidadTotalRegistros = parseInt(cabecera, 10);
    })
  }

  //funcion para escribir a la vez en la url
  escribirParametrosBusquedaEnUrl(valores: FiltroPeliculas) {
    let queryString = [];
    if (valores.titulo) {
      queryString.push(`titulo=${encodeURIComponent(valores.titulo)}`); //encode hace que sea aceptable el nombre para estar en una url
    }
    if (valores.generoId !== 0) {
      queryString.push(`generoId:${valores.generoId}`); //aqui al ser numero siempre sera valido
    }
    if (valores.proximosEstrenos) {
      queryString.push(`proximosEstrenos:${valores.proximosEstrenos}`);
    }
    if (valores.enCines) {
      queryString.push(`enCines:${valores.enCines}`);
    }
    this.location.replaceState('peliculas/filtrar/', queryString.join('&')); //para unirlos en la url
  }

  //funcion para leer valores URL
  leerValoresUrl() {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      var objeto: any = {};

      if (params.titulo) {
        //si hay un titulo..
        objeto.titulo = params.titulo
      }
      if (params.generoId) {
        objeto.generoId = Number(params.generoId);
      }
      if (params.proximosEstrenos) {
        objeto.proximosEstrenos = params.proximosEstrenos
      }
      if (params.enCines) {
        objeto.enCines = params.enCines;
      }
      //Actualiza el formulario con los valores de la URL
      this.form.patchValue(objeto);
    })
  }

  //funcion pàra limpiar el formulario
  limpiar() {
    this.form.patchValue({ titulo: '', generoId: 0, proximosEstrenos: false, enCines: false });
  }

  actualizarPaginacion(datos : PageEvent){
    this.paginacion = {pagina: datos.pageIndex +1, recordPorPagina: datos.pageSize};
    this.buscarPeliculas(this.form.value as FiltroPeliculas);
  }

  private formBuilder = inject(FormBuilder);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);

  form = this.formBuilder.group({
    titulo: '',
    generoId: 0,
    proximosEstrenos: false,
    enCines: false
  })

  generos!: GeneroDTO[];
  peliculas!: PeliculaDTO[];

  




}


