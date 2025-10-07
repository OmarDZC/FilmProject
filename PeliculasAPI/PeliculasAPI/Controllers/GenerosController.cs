using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;
using System.Threading.Tasks;

namespace PeliculasAPI.Controllers
{
    [ApiController]
    [Route("api/generos")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "esadmin")]
    public class GenerosController: CustomBaseController
    {
        private readonly IOutputCacheStore outputCacheStore;
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private const string cacheTag = "generos"; //el tag para limpiar cache

        public GenerosController(IOutputCacheStore outputCacheStore, ApplicationDbContext context, IMapper mapper)
            : base(context, mapper, outputCacheStore, cacheTag) //por haber cogido la clase custom
        {
            this.outputCacheStore = outputCacheStore;
            this.context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        [OutputCache(Tags = [cacheTag])] //que la API tenga cache y el tag para limpiar el cache
        public async Task<List<GeneroDTO>> Get([FromQuery]PaginacionDTO paginacion)
        {
            //viene de customBaseController
            return await Get<Genero, GeneroDTO>(paginacion, ordenarPor: x => x.Nombre);
        }

        [HttpGet("todos")]
        [OutputCache(Tags = [cacheTag])]
        [AllowAnonymous] //todos pueden usarla
        public async Task<List<GeneroDTO>> Get()
        {
            //viene de customBaseController
            return await Get<Genero, GeneroDTO>(ordenarPor: x => x.Nombre);
        }

        [HttpGet("{id:int}", Name = "ObtenerGeneroPorId")]
        [OutputCache(Tags = [cacheTag])]
        public async Task <ActionResult<GeneroDTO>> Get(int id)
        {
            return await Get<Genero, GeneroDTO>(id);
        }

        [HttpPost]
        [OutputCache(Tags = [cacheTag])]
        public async Task<IActionResult> Post([FromBody]GeneroCreacionDTO generoCreacionDTO)
        {
            return await Post<GeneroCreacionDTO, Genero, GeneroDTO>(generoCreacionDTO, "ObtenerGeneroPorId");
        }

        [HttpPut("{id:int}")]
        public async Task <IActionResult> Put(int id, [FromBody] GeneroCreacionDTO generoCreacionDTO)
        {
            return await Put<GeneroCreacionDTO, Genero>(id, generoCreacionDTO);  
        }

        [HttpDelete("{id:int}")]
        public async Task <IActionResult> Delete(int id)
        {
            return await Delete<Genero>(id);
        }





    }
}
