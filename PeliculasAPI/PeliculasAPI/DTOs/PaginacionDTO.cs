namespace PeliculasAPI.DTOs
{
    public class PaginacionDTO
    {
        public int Pagina { get; set; } = 1;
        private int recordsPorPagina = 10;
        private readonly int cantidadMaxRecordsPorPagina = 50; //no se puede pasar de 50

        public int RecordPorPagina
        {
            get {  return recordsPorPagina; }
            set
            {
                //si es falso solo mostrara 50, si es verdadero solo saldra las que tiene el value
                recordsPorPagina = (value > cantidadMaxRecordsPorPagina) ? cantidadMaxRecordsPorPagina : value;
            }
        }
    }
}
