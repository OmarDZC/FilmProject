﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPI.Utilidades;
using System.Linq.Expressions;

namespace PeliculasAPI.Controllers
{
    public class CustomBaseController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IMapper mapper;
        private readonly IOutputCacheStore outputCacheStore;
        private readonly string cacheTag;

        public CustomBaseController(ApplicationDbContext context, IMapper mapper, IOutputCacheStore outputCacheStore,
            string cacheTag)
        {
            this.context = context;
            this.mapper = mapper;
            this.outputCacheStore = outputCacheStore;
            this.cacheTag = cacheTag;
        }

        protected async Task<List<TDTO>> Get <TEntidad, TDTO>(PaginacionDTO paginacion, 
            Expression<Func<TEntidad, object>> ordenarPor) where TEntidad: class //expression => func (almacena Tentidad y object)
        {
            var queryable = context.Set<TEntidad>().AsQueryable();
            await HttpContext.InsertarParametrosPaginacionEnCabeceras(queryable);
            return await queryable
                .OrderBy(ordenarPor)
                .Paginar(paginacion)
                .ProjectTo<TDTO>(mapper.ConfigurationProvider)
                .ToListAsync();
        }

        protected async Task<ActionResult<TDTO>> Get<TEntidad, TDTO>(int id) 
            where TEntidad : class, IId
            where TDTO : IId
        {
            var entidad = await context.Set<TEntidad>()
                .ProjectTo<TDTO>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == id); //al implementar IId que tiene todas las id va a tener la propiedad id

            if(entidad is null)
            {
                return NotFound();
            }
            return entidad;
        }

        protected async Task<IActionResult> Post <TCreacionDTO, TEntidad, TDTO>
            (TCreacionDTO creacionDTO, string nombreRuta)
            where TEntidad : class, IId
        {
            var entidad = mapper.Map<TEntidad>(creacionDTO);

            context.Add(entidad);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default); //para limpiar el cache al crear o actualizars

            //el id viene de genero.Id, se crea un id nuevo se le asigna a Id de genero,  y genero porque puedo devolverlo
            var entidadDTO = mapper.Map<TDTO>(entidad);
            return CreatedAtRoute(nombreRuta, new { id = entidad.Id }, entidadDTO);
        }

        protected async Task<IActionResult> Put<TCreacionDTO, TEntidad>(int id, TCreacionDTO creacionDTO)
            where TEntidad : class, IId
        {
            var entidadExiste = await context.Set<TEntidad>().AnyAsync(x => x.Id == id);
            if (!entidadExiste)
            {
                return NotFound();
            }

            var generoExiste = await context.generos.AnyAsync(x => x.Id == id);
            if (!generoExiste)
            {
                return NotFound();
            }
            var entidad = mapper.Map<TEntidad>(creacionDTO);
            entidad.Id = id;

            context.Update(entidad);
            await context.SaveChangesAsync();
            await outputCacheStore.EvictByTagAsync(cacheTag, default); //para limpiar el cache al crear o actualizars

            return NoContent(); //esta ok no retorna contenido
        }

        protected async Task<IActionResult> Delete<TEntidad> (int id)
            where TEntidad : class, IId
        {
            var registrosBorrados = await context.Set<TEntidad>().Where(x => x.Id == id).ExecuteDeleteAsync();
            if (registrosBorrados == 0)
            {
                return NotFound();
            }
            await outputCacheStore.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }



    }
}
