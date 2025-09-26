using AutoMapper;
using NetTopologySuite.Geometries;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;

namespace PeliculasAPI.Utilidades
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles(GeometryFactory geometryFactory)
        {
            configurarMapeoGeneros();
            configurarMapeoActores();
            configurarMapeoCines(geometryFactory);
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

        private void configurarMapeoCines(GeometryFactory geometryFactory)
        {
            //hay que transformar latitud/longitud con ubicacion que tienen los cines y se hnara con geometryFactory
            CreateMap<Cine, CineDTO>()
                .ForMember(x => x.Latitud, cine => cine.MapFrom(x => x.Ubicacion.X))
                .ForMember(x => x.Longitud, cine => cine.MapFrom(x => x.Ubicacion.Y));

            CreateMap<CineCreacionDTO, Cine>()
                .ForMember(x => x.Ubicacion, cineDTO => cineDTO.MapFrom(x => 
                    geometryFactory.CreatePoint(new Coordinate(x.Longitud, x.Latitud))));
        }





    }
}
