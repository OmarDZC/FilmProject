using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Servicios;
using PeliculasAPI.Utilidades;

namespace PeliculasAPI.Controllers
{
    [Route("api/peliculas")]
    [ApiController]
    public class PeliculasController : CustomBaseController
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly IAlmacenadorArchivos almacenadorArchivos;
        private const string cacheTag = "peliculas";
        private readonly string contenedor = "peliculas";

        public PeliculasController(ApplicationDbContext context, IMapper mapper, IOutputCacheStore outputCacheStore, IAlmacenadorArchivos almacenadorArchivos) 
            :base(context, mapper, outputCacheStore, cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.outputCacheStore = outputCacheStore;
            this.almacenadorArchivos = almacenadorArchivos;
        }

        [HttpGet("landing")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<LandingPageDTO>> Get()
        {
            var top = 6; //maximo mostrar 6
            var hoy = DateTime.Today;
            //proximos estrenos..
            var proximosEstrenos = await context.Peliculas
                .Where(x => x.FechaLanzamiento > hoy)
                .OrderBy(x => x.FechaLanzamiento)
                .Take(6) //coger las 6 primeras
                .ProjectTo<PeliculaDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            //en cines..
            var enCines = await context.Peliculas
                .Where(x => x.PeliculasCines.Select(pc => pc.PeliculaId).Contains(x.Id)) //encuentra las peliculasId que contengan esa id que buscamos
                .OrderBy(x => x.FechaLanzamiento)
                .Take(6)
                .ProjectTo<PeliculaDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            var resultado = new LandingPageDTO();
            resultado.EnCines = enCines;
            resultado.ProximosEstrenos = proximosEstrenos;
            return resultado;
        }

        [HttpGet("{id:int}", Name = "ObtenerPeliculaPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<PeliculaDetallesDTO>> Get (int id)
        {
            var pelicula = await context.Peliculas
                .ProjectTo<PeliculaDetallesDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            if(pelicula is null)
            {
                return NotFound();
            }

            return pelicula;
        }

        [HttpGet("filtrar")]
        public async Task<ActionResult<List<PeliculaDTO>>> Filtrar([FromQuery] PeliculasFiltrarDTO peliculasFiltrarDTO)
        {
            var peliculasQueryable = context.Peliculas.AsQueryable();
            if (!string.IsNullOrWhiteSpace(peliculasFiltrarDTO.Titulo))
            {
                //si hay titulo para filtrar..
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.Titulo.Contains(peliculasFiltrarDTO.Titulo));
            }

            if (peliculasFiltrarDTO.EnCines)
            {
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.PeliculasCines
                    .Select(pc => pc.PeliculaId).Contains(p.Id));
            }

            if (peliculasFiltrarDTO.ProximosEstrenos)
            {
                var hoy = DateTime.Today;
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.FechaLanzamiento > hoy);
            }

            //buscar por generos
            if (peliculasFiltrarDTO.GeneroId != 0)
            {
                peliculasQueryable = peliculasQueryable
                    .Where(p => p.PeliculasGeneros
                    .Select(pg => pg.GeneroId).Contains(peliculasFiltrarDTO.GeneroId)); //se compara con el genero que pasa el peliculasFiltrar
            }

            await HttpContext.InsertarParametrosPaginacionEnCabeceras(peliculasQueryable);
            var peliculas = await peliculasQueryable.Paginar(peliculasFiltrarDTO.Paginacion)
                .ProjectTo<PeliculaDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            return peliculas;
        }

        [HttpGet("PostGet")]
        public async Task<ActionResult<PeliculasPostGetDTO>> PostGet()
        {
            var cines = await context.Cines.ProjectTo<CineDTO>(mapper.ConfigurationProvider).ToListAsync();
            var generos = await context.generos.ProjectTo<GeneroDTO>(mapper.ConfigurationProvider).ToListAsync();

            return new PeliculasPostGetDTO
            {
                Cines = cines,
                Generos = generos
            };
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm] PeliculaCreacionDTO peliculaCreacionDTO)
        {
            var pelicula = mapper.Map<Pelicula>(peliculaCreacionDTO);
            
            if(peliculaCreacionDTO.Poster is not null)
            {
                var url = await almacenadorArchivos.Almacenar(contenedor, peliculaCreacionDTO.Poster);
                pelicula.Poster = url;
            }  

            AsignarOrdenActores(pelicula);
            context.Add(pelicula);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            var peliculaDTO = mapper.Map<PeliculaDTO>(pelicula);
            return CreatedAtRoute("ObtenerPeliculaPorId", new {id = pelicula.Id}, peliculaDTO);
        }

        [HttpGet("PutGet/{id:int}")]
        public async Task<ActionResult<PeliculasPutGetDTO>> PutGet(int id)
        {
            //recoger los generos seleccionados
            var pelicula = await context.Peliculas
                .ProjectTo<PeliculaDetallesDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id);

            if(pelicula is null)
            {
                return NotFound();
            }

            //obtener los no seleccionados
            var generosSeleccionadosIds = pelicula.Generos
                .Select(x => x.Id).ToList();
            //obtener los que no se encuentren (los que no sean los seleccionados)
            var generosNoSeleccionados = await context.generos
                .Where(x => !generosSeleccionadosIds.Contains(x.Id))
                .ProjectTo<GeneroDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            //cines => 
            var cinesSeleccionadosIds = pelicula.Cines
                .Select(x => x.Id).ToList();
            var cinesNoSeleccionados = await context.Cines
                .Where(x => !cinesSeleccionadosIds.Contains(x.Id))
                .ProjectTo<CineDTO>(mapper.ConfigurationProvider)
                .ToListAsync();

            var respuesta = new PeliculasPutGetDTO();
            respuesta.Pelicula = pelicula;
            respuesta.GenerosSeleccionados = pelicula.Generos;
            respuesta.GenerosNoSeleccionados = generosNoSeleccionados;
            respuesta.CinesSeleccionados = pelicula.Cines;
            respuesta.CinesNoSeleccionados = cinesNoSeleccionados;
            respuesta.Actores = pelicula.Actores;
            return respuesta;
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put (int id, [FromForm] PeliculaCreacionDTO peliculaCreacionDTO)
        {
            var pelicula = await context.Peliculas
                .Include(p => p.PeliculasActores)
                .Include(p => p.PeliculasCines)
                .Include(p => p.PeliculasGeneros)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pelicula is null)
            {
                return NotFound();
            }

            //en el resultado el usuario podria dejar igual, quitar o agregar
            pelicula = mapper.Map(peliculaCreacionDTO, pelicula);
            if(peliculaCreacionDTO.Poster is not null)
            {
                pelicula.Poster = await almacenadorArchivos.Editar(pelicula.Poster, contenedor, peliculaCreacionDTO.Poster);
            }

            AsignarOrdenActores(pelicula);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();

        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            return await Delete<Pelicula>(id);
        }





        //guardar orden que se guardan los autores
        private void AsignarOrdenActores(Pelicula pelicula)
        {
            if(pelicula.PeliculasActores is not null)
            {
                for (int i = 0; i < pelicula.PeliculasActores.Count; i++)
                {
                    pelicula.PeliculasActores[i].Orden = i;
                }
            }
        }










    }
}
