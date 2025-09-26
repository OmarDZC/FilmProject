using AutoMapper;
using NetTopologySuite.Geometries;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;

namespace PeliculasAPI.Utilidades
{
    public class AutoMapperProfiles : Profile
    {
        private readonly GeometryFactory geometryFactory;

        public AutoMapperProfiles(GeometryFactory geometryFactory)
        {
            configurarMapeoGeneros();
            configurarMapeoActores();
            this.geometryFactory = geometryFactory;
        }

        private void configurarMapeoGeneros()
        { 
            CreateMap<GeneroCreacionDTO, Genero>(); //origen , destino
            CreateMap<Genero, GeneroDTO>(); //origen , destino
        }

        private void configurarMapeoActores()
        {
            CreateMap<ActorCreacionDTO, Actor>()
                .ForMember(x => x.Foto, opciones => opciones.Ignore());
            CreateMap<Actor, ActorDTO>();
        }






    }
}
