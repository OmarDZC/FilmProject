using PeliculasAPI.Entidades;
using PeliculasAPI.Validaciones;
using System.ComponentModel.DataAnnotations;

namespace PeliculasAPI.DTOs
{
    public class GeneroDTO : IId
    {
        //lectura (sin validaciones porque es solo para leer)
        public int Id { get; set; }
        public required string Nombre { get; set; } //required => caracteristica de C# pero no como validacion
    }
}
