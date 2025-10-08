using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using PeliculasAPI.Controllers;
using PeliculasAPI.DTOs;
using PeliculasAPI.Entidades;
using PeliculasAPIPruebas.Dobles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PeliculasAPIPruebas.Controllers
{
    [TestClass]
    public sealed class GenerosControllerPruebas: BasePruebas
    {
        [TestMethod]
        public async Task Get_DevuelveTodosLosGeneros()
        {
            //preparacion
            var nombreBD = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreBD);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = null!;

            contexto.generos.Add(new Genero() { Nombre = "Genero 1" });
            contexto.generos.Add(new Genero() { Nombre = "Genero 2" });
            await contexto.SaveChangesAsync();

            var contexto2 = ConstruirContext(nombreBD); //otro contexto que no tiene en memoria los datos anteriores de prueba
            var controller = new GenerosController(outputCacheStore, contexto2, mapper);

            //prueba
            var respuesta = await controller.Get();

            //verificacion
            Assert.AreEqual(expected: 2, actual: respuesta.Count); //espera que sean 2 registros 
        }

        [TestMethod]
        public async Task Get_DevolverGeneroCorrecto_CuandoGeneroConIdExiste()
        {
            //preparacion
            var nombreBD = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreBD);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = null!;

            contexto.generos.Add(new Genero() { Nombre = "Genero 1" });
            contexto.generos.Add(new Genero() { Nombre = "Genero 2" });
            await contexto.SaveChangesAsync();

            var contexto2 = ConstruirContext(nombreBD); //otro contexto que no tiene en memoria los datos anteriores de prueba
            var controller = new GenerosController(outputCacheStore, contexto2, mapper);

            var id = 1;

            //prueba
            var respuesta = await controller.Get(id);

            //verificacion
            var resultado = respuesta.Value;
            Assert.AreEqual(expected: id, actual: resultado!.Id); //resultado esperamos que sea el mismo que el ID
        }

        [TestMethod]
        public async Task Get_Devolver404_CuandoGeneroConIdNoExiste()
        {
            //preparacion
            var nombreBD = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreBD);
            var mapper = ConfigurarAutoMapper();
            IOutputCacheStore outputCacheStore = null!;

            await contexto.SaveChangesAsync();

            var controller = new GenerosController(outputCacheStore, contexto, mapper); //como el contexto no se manipula se pasaa directamente
            var id = 1;

            //prueba
            var respuesta = await controller.Get(id);

            //verificacion
            var resultado = respuesta.Result as StatusCodeResult; //si es 404, 400... 
            Assert.AreEqual(expected: 404, actual: resultado!.StatusCode); //espera que sean 2 registros 
        }

        [TestMethod]
        public async Task Post_DebeCrearGenero_CuandoEnviamosGenero()
        {
            //preparacion
            var nombreBD = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreBD);
            var mapper = ConfigurarAutoMapper();
            var outputCacheStore = new OutputcacheStoreFalso();

            var nuevoGenero = new GeneroCreacionDTO() { Nombre = "Nuevo Genero" };
            var controller = new GenerosController(outputCacheStore, contexto, mapper);

            //prueba
            var respuesta = await controller.Post(nuevoGenero);

            //verificacion (queremos verificar que se hace route)
            var resultado = respuesta as CreatedAtRouteResult;
            Assert.IsNotNull(resultado);

            // => que no este manipulado para buscar en db
            var contexto2 = ConstruirContext(nombreBD);
            var cantidad = await contexto2.generos.CountAsync();
            Assert.AreEqual(expected: 1, actual: cantidad);
        }

        private const string cacheTag = "generos";
        [TestMethod]
        public async Task Post_DebeLLamarEvictByTagAsync_CuandoEnviamosGenero()
        {
            //preparacion
            var nombreBD = Guid.NewGuid().ToString();
            var contexto = ConstruirContext(nombreBD);
            var mapper = ConfigurarAutoMapper();
            //var outputCacheStore = new OutputcacheStoreFalso();
            var outputCacheStore = Substitute.For<OutputcacheStoreFalso>(); //es como un doble => permite verificar

            var nuevoGenero = new GeneroCreacionDTO() { Nombre = "Nuevo Genero" };
            var controller = new GenerosController(outputCacheStore, contexto, mapper);

            //prueba
            var respuesta = await controller.Post(nuevoGenero);

            //verificacion
            await outputCacheStore.Received(1).EvictByTagAsync(cacheTag, default); //que sea ejecutado 1 vez y con esos parametros
        }
    }
}
