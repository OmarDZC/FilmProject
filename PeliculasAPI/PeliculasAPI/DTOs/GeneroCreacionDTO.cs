using PeliculasAPI.Validaciones;
using System.ComponentModel.DataAnnotations;

namespace PeliculasAPI.DTOs
{
    public class GeneroCreacionDTO
    {
        //para crear (sin ID)
        [Required(ErrorMessage = "El campo {0} es requerido")] //regla de validacion => campo 0 = nombre
        [StringLength(20, ErrorMessage = "El campo {0} debe tener {1} caracteres o más")] //campo 1 = 20 caracteres
        [PrimeraLetraMayuscula]
        public required string Nombre { get; set; } //required => caracteristica de C# pero no como validacion
    }
}
