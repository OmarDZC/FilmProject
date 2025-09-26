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



@Component({
  selector: 'app-filtro-peliculas',
  imports: [MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatCheckboxModule, ListadoPeliculasComponent],
  templateUrl: './filtro-peliculas.component.html',
  styleUrl: './filtro-peliculas.component.css'
})
export class FiltroPeliculasComponent implements OnInit{
  ngOnInit(): void {
    this.leerValoresUrl();
    this.buscarPeliculas(this.form.value as FiltroPeliculas); //si yo modifico formulario a traves de actualizar la url, queremos los filtros a traves de aqui
    //suscribe => reacciona a los cambios que estan pasando (ej: que se filtre las peliculas segun lo que yo escriba en la busqueda)
    this.form.valueChanges.subscribe(valores => {
      console.log(valores);//se iria disparando todo el tiempo el console.log segun lo que yo escriba (1 letra, 2 letras... )
      this.peliculas = this.peliculasOriginal;
      this.buscarPeliculas(valores as FiltroPeliculas);
      this.escribirParametrosBusquedaEnUrl(valores as FiltroPeliculas);
    })
  }

  //funcion para buscar las peliculas
  buscarPeliculas(valores: FiltroPeliculas) {
    if(valores.titulo){
      //busca dentro del titulo con indexOf y si no encuentra devuelve -1 (no se mostraran)
      this.peliculas = this.peliculas.filter(pelicula => pelicula.titulo.indexOf(valores.titulo) !== -1);
    }

    if(valores.generoId !== 0){
      this.peliculas = this.peliculas.filter(pelicula => pelicula.generos.indexOf(valores.generoId) !== -1);
    }

    if(valores.proximosEstrenos){
      this.peliculas = this.peliculas.filter(pelicula => pelicula.proximosEstrenos);
    }

    if(valores.enCines){
      this.peliculas = this.peliculas.filter(pelicula => pelicula.enCines);
    }
  }

  //funcion para escribir a la vez en la url
  escribirParametrosBusquedaEnUrl(valores: FiltroPeliculas) {
    let queryString = [];
    if(valores.titulo){
      queryString.push(`titulo=${encodeURIComponent(valores.titulo)}`); //encode hace que sea aceptable el nombre para estar en una url
    }
    if(valores.generoId !== 0){
      queryString.push(`generoId:${valores.generoId}`); //aqui al ser numero siempre sera valido
    }
    if(valores.proximosEstrenos){
      queryString.push(`proximosEstrenos:${valores.proximosEstrenos}`);
    }
    if(valores.enCines){
      queryString.push(`enCines:${valores.enCines}`);
    }
    this.location.replaceState('peliculas/filtrar/', queryString.join('&')); //para unirlos en la url
  }

  //funcion para leer valores URL
  leerValoresUrl(){
    this.activatedRoute.queryParams.subscribe((params: any) => {
      var objeto: any = {};
      
      if(params.titulo){
        //si hay un titulo..
        objeto.titulo = params.titulo
      }
      if(params.generoId){
        objeto.generoId = Number(params.generoId);
      }
      if(params.proximosEstrenos){
        objeto.proximosEstrenos = params.proximosEstrenos
      }
      if(params.enCines){
        objeto.enCines = params.enCines;
      }
      //Actualiza el formulario con los valores de la URL
      this.form.patchValue(objeto);
    })
  }

  //funcion pàra limpiar el formulario
  limpiar() {
    this.form.patchValue({titulo: '', generoId: 0, proximosEstrenos: false, enCines: false});
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

  generos = [
    { id: 1, nombre: "Yuri" },
    { id: 2, nombre: "Shonen" },
    { id: 3, nombre: "Mecha" },
  ]

  peliculasOriginal = [
    {
      titulo: "Kimetsu no Yaiba",
      fechaSalida: new Date(),
      precio: 14,
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Kimetsu_no_Yaiba_logo.svg/250px-Kimetsu_no_Yaiba_logo.svg.png",
      generos: [1,2,3],
      enCines: false,
      proximosEstrenos: true
    },
    {
      titulo: "Naruto",
      fechaSalida: new Date("2025-12-03"),
      precio: 12,
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Naruto_logo.svg/250px-Naruto_logo.svg.png",
      generos: [1],
      enCines: true,
      proximosEstrenos: false
    },
    {
      titulo: "One Piece",
      fechaSalida: new Date("2027-01-11"),
      precio: 20,
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/One_piece_logo.svg/250px-One_piece_logo.svg.png",
      generos: [3],
      enCines: false,
      proximosEstrenos: false
    },
    {
      titulo: "Kaijuu n8",
      fechaSalida: new Date("2026-05-13"),
      precio: 17,
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/%E6%80%AA%E7%8D%A38%E5%8F%B7_logo_%281%29.svg/330px-%E6%80%AA%E7%8D%A38%E5%8F%B7_logo_%281%29.png",
      generos: [2,3],
      enCines: false,
      proximosEstrenos: true
    },
    {
      titulo: "Shingeki No Kyojin",
      fechaSalida: new Date("2027-10-01"),
      precio: 10.99,
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Attack_on_Titan_logo.svg/250px-Attack_on_Titan_logo.svg.png",
      generos: [1,2],
      enCines: false,
      proximosEstrenos: true
    },
    {
      titulo: "Pokemon 10",
      fechaSalida: new Date("2027-11-11"),
      precio: 15.99,
      poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/250px-International_Pok%C3%A9mon_logo.svg.png",
      generos: [2],
      enCines: true,
      proximosEstrenos: false
    }
  ]

  peliculas = this.peliculasOriginal;


}
