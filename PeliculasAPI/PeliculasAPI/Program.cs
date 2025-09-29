using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using PeliculasAPI;
using PeliculasAPI.Servicios;
using PeliculasAPI.Utilidades;

var builder = WebApplication.CreateBuilder(args);

// ---- AREA DE SERVICIOS ----
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Automapper => y tambien se le añade el geometry factory para la ubicacion de cines y coordenadas en Tierra
//builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddSingleton(proveedor => new MapperConfiguration(configuracion =>
{
    var geometryFactory = proveedor.GetRequiredService<GeometryFactory>();
    configuracion.AddProfile(new AutoMapperProfiles(geometryFactory));
}).CreateMapper());

//conexion BD
builder.Services.AddDbContext<ApplicationDbContext>(opciones =>
{
    //sqlServer => netTopologySuite para usar la topologia y ayudar a saber la ubicacion en cines
    opciones.UseSqlServer("name=DefaultConnection", sqlServer => sqlServer.UseNetTopologySuite()); 
});

//servicio de ubicacion ==> para trabajar con coordenadas en la Tierra
builder.Services.AddSingleton<GeometryFactory>(NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326));

//servicio de cache
builder.Services.AddOutputCache(opciones =>
{
    opciones.DefaultExpirationTimeSpan = TimeSpan.FromSeconds(60);
});
//si le piden injeccion de iRepositorio le da RepositorioEnMemoria => Singleton porque trabaja en memoria y siempre sera el mismo hasta que se cierre la app
var origenesPermitidos = builder.Configuration.GetValue<string>("origenesPermitidos")!.Split(","); //split por si son varios origenes
builder.Services.AddCors(opciones =>
{
    opciones.AddDefaultPolicy(opcionesCORS =>
    {
        //permite origen (cualquier dominio), cualquier metodo, cualquier header de peticion http
        opcionesCORS.WithOrigins(origenesPermitidos).AllowAnyMethod().AllowAnyHeader()
        .WithExposedHeaders("cantidad-total-registros"); 
    });
});

//configuracion almacenador archivos
builder.Services.AddTransient<IAlmacenadorArchivos, AlmacenadorArchivosLocal>();
builder.Services.AddHttpContextAccessor();




// ---- MIDLEWARES ----
var app = builder.Build(); //siempre DESPUES de servicios, PRIMER MIDDLEWARE
// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseStaticFiles(); //para uso de archivos estaticos

app.UseCors();

app.UseOutputCache();

app.UseAuthorization();

app.MapControllers();

app.Run();
