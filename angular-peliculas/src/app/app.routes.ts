import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { IndiceGenerosComponent } from './generos/indice-generos/indice-generos.component';
import { CrearGenerosComponent } from './generos/crear-generos/crear-generos.component';
import { IndiceActoresComponent } from './actores/indice-actores/indice-actores.component';
import { CrearActorComponent } from './actores/crear-actor/crear-actor.component';
import { IndiceCinesComponent } from './cines/indice-cines/indice-cines.component';
import { CrearCineComponent } from './cines/crear-cine/crear-cine.component';
import { CrearPeliculaComponent } from './peliculas/crear-pelicula/crear-pelicula.component';
import { EditarGeneroComponent } from './generos/editar-genero/editar-genero.component';
import { EditarActorComponent } from './actores/editar-actor/editar-actor.component';
import { EditarCineComponent } from './cines/editar-cine/editar-cine.component';
import { EditarPeliculaComponent } from './peliculas/editar-pelicula/editar-pelicula.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { FiltroPeliculasComponent } from './peliculas/filtro-peliculas/filtro-peliculas.component';
import { DetallePeliculasComponent } from './peliculas/detalle-peliculas/detalle-peliculas.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent}, //se añade el landingPage como primera pagina
    { path: 'generos', component: IndiceGenerosComponent},
    { path: 'generos/crear', component: CrearGenerosComponent},
    //para editar el genero /:id va a recibir variable => para leer el valor de :id => provideRouter
    { path: 'generos/editar/:id', component: EditarGeneroComponent},
    
    { path: 'actores', component: IndiceActoresComponent },
    { path: 'actores/crear', component: CrearActorComponent},
    { path: 'actores/editar/:id', component: EditarActorComponent},
    
    { path: 'cines', component: IndiceCinesComponent}, 
    { path: 'cines/crear', component: CrearCineComponent},
    { path: 'cines/editar/:id', component: EditarCineComponent},

    { path: 'peliculas/crear', component: CrearPeliculaComponent},
    { path: 'peliculas/editar/:id', component: EditarPeliculaComponent},
    { path: 'peliculas/filtrar', component: FiltroPeliculasComponent},

    { path: 'pelicula/:id', component:DetallePeliculasComponent},

    { path: '**', component: NotFoundComponent } //para cuando no encuentre ruta, las rutas que no existan todas iran aqui => SIEMPRE VA EL ULTIMO
];
