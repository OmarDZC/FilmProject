using Microsoft.EntityFrameworkCore;
using PeliculasAPI.Entidades;

namespace PeliculasAPI
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        //configurar llave primaria de pelicula genero (generoId, peliculaId) llave de varias columnas
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); //no se borra

            modelBuilder.Entity<PeliculaGenero>().HasKey(e => new {e.GeneroId, e.PeliculaId}); //llave compuesta de generoId y peliculaId
            modelBuilder.Entity<PeliculaCine>().HasKey(e => new { e.CineId, e.PeliculaId });
            modelBuilder.Entity<PeliculaActor>().HasKey(e => new { e.ActorId, e.PeliculaId });
        }

        public DbSet<Genero> generos { get; set; }
        public DbSet<Actor> Actores { get; set; }
        public DbSet<Cine> Cines { get; set; }
        public DbSet<Pelicula> Peliculas { get; set; }
        public DbSet <PeliculaGenero> PeliculasGeneros { get; set; }
        public DbSet<PeliculaCine> PeliculasCines { get; set; }
        public DbSet<PeliculaActor> PeliculasActores { get; set; }
    }
}
