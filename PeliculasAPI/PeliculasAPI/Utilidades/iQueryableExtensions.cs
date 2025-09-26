using PeliculasAPI.DTOs;
using System.Runtime.CompilerServices;

namespace PeliculasAPI.Utilidades
{
    public static class iQueryableExtensions
    {
        public static IQueryable<T> Paginar<T> (this IQueryable<T> queryable, PaginacionDTO paginacion)
        {
            return queryable
                .Skip((paginacion.Pagina - 1) * paginacion.RecordPorPagina) //saltar 0 si estas en la pagina 1, si no.. saltas a los siguientes 50
                .Take(paginacion.RecordPorPagina); //coger solo recordsPorPagina 
        }
    }
}
