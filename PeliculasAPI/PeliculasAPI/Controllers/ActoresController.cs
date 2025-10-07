using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Servicios;
using PeliculasAPI.Utilidades;

namespace PeliculasAPI.Controllers
{
    [Route("api/actores")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "esadmin")] //y se configurra el claim en cada controlador
    public class ActoresController : CustomBaseController   
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly IAlmacenadorArchivos almacenadorArchivo;
        private const string cacheTag = "actores";
        private readonly string contenedor = "actores";

        public ActoresController(ApplicationDbContext context, IMapper mapper, IOutputCacheStore outputCacheStore,
            IAlmacenadorArchivos almacenadorArchivo): base(context,mapper, outputCacheStore, cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.outputCacheStore = outputCacheStore;
            this.almacenadorArchivo = almacenadorArchivo;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])]
        public async Task<List<ActorDTO>> Get([FromQuery] PaginacionDTO paginacion)
        {
            return await Get<Actor, ActorDTO>(paginacion, ordenarPor: x => x.Nombre);
        }


        [HttpGet("{id:int}", Name = "obtenerAutorPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<ActorDTO>> Get(int id)
        {
           return await Get<Actor, ActorDTO>(id);
        }

        [HttpGet("{nombre}")]
        public async Task<ActionResult<List<PeliculaActorDTO>>> Get(string nombre)
        {
            //si escribe A, recupera todos los actores que contengan
            return await context.Actores.Where(x => x.Nombre.Contains(nombre))
                .ProjectTo<PeliculaActorDTO>(mapper.ConfigurationProvider).ToListAsync();
        }

        [HttpPost]
        [OutputCache(Tags = [cacheTag])]
        //fromform para crear con foto
        public async Task <IActionResult> Post([FromForm] ActorCreacionDTO actorCreacionDTO) 
        {
            var actor = mapper.Map<Actor>(actorCreacionDTO);

            if(actorCreacionDTO.Foto is not null)
            {
                var url = await almacenadorArchivo.Almacenar(contenedor, actorCreacionDTO.Foto);
                actor.Foto = url; //es la url que se guarda en nube o en maquina
            }

            context.Add(actor);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);

            return CreatedAtRoute("obtenerAutorPorId", new {id = actor.Id}, actor);
        }

        [HttpPut("{id:int}")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<IActionResult> Put(int id, [FromForm] ActorCreacionDTO actorCreacionDTO)
        {
            var actor = await context.Actores.FirstOrDefaultAsync(x => x.Id == id);
            if(actor is null)
            {
                return NotFound();
            }
            //si no es null..
            actor = mapper.Map(actorCreacionDTO, actor);
            if(actorCreacionDTO.Foto is not null)
            {
                actor.Foto = await almacenadorArchivo.Editar(actor.Foto, contenedor, actorCreacionDTO.Foto);
            }

            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }

        [HttpDelete("{id:int}")] //en actores solo se hace delete porque post y put tienen foto
        [OutputCache(Tags = [cacheTag])]
        public async Task<IActionResult> Delete(int id)
        {
            return await Delete<Actor>(id);
        }












    }
}
