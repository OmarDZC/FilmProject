namespace PeliculasAPI.Entidades
{
    public class PeliculaGenero //entidad N:N entre Pelicula y Genero
    {
        public int GeneroId { get; set; }
        public int PeliculaId { get; set; }
        public Genero genero { get; set; } = null!; //navegar entre las relaciones de las entidades 
        public Pelicula pelicula { get; set; } = null!;
    }
}
