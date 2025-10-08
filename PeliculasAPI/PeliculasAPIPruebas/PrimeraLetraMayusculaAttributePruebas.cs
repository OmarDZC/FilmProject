using PeliculasAPI.Validaciones;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PeliculasAPIPruebas
{
    [TestClass]
    public sealed class PrimeraLetraMayusculaAttributePruebas
    {
        [TestMethod]
        [DataRow("")] //que valor tiene la variable (string vacio "") => misma prueba con varios valores
        [DataRow("   ")]
        [DataRow(null)]
        public void isValid_DebeRetornarExitoso_SiElValorEsVacio(string valor)
        {
            //preparara
            var primeraLetraMayuscula = new PrimeraLetraMayusculaAttribute();
            var validationContext = new ValidationContext(new object());
            //var valor = string.Empty; //el vaalor a probar empieza vacio

            //probar
            var resultado = primeraLetraMayuscula.GetValidationResult(valor, validationContext);

            //verificar
            Assert.AreEqual(expected: ValidationResult.Success, actual: resultado); //asegurar... que sea success => y obtenemos.. si es igual esta exitoso
        }

        [TestMethod]
        [DataRow("Omar")]
        public void isValid_DebeRetornarExitoso_SiLaPrimeraLetraEsMayuscula(string valor)
        {
            //preparara
            var primeraLetraMayuscula = new PrimeraLetraMayusculaAttribute();
            var validationContext = new ValidationContext(new object());
            //var valor = string.Empty; //el vaalor a probar empieza vacio

            //probar
            var resultado = primeraLetraMayuscula.GetValidationResult(valor, validationContext);

            //verificar
            Assert.AreEqual(expected: ValidationResult.Success, actual: resultado);
        }

        [TestMethod]
        [DataRow("omar")]
        public void isValid_DebeRetornarError_SiLaPrimeraLetraNoEsMayuscula(string valor)
        {
            //preparara
            var primeraLetraMayuscula = new PrimeraLetraMayusculaAttribute();
            var validationContext = new ValidationContext(new object());
            //var valor = string.Empty; //el vaalor a probar empieza vacio

            //probar
            var resultado = primeraLetraMayuscula.GetValidationResult(valor, validationContext);

            //verificar
            Assert.AreEqual(expected: "La primera letra debe ser mayúscula", actual: resultado!.ErrorMessage);
        }





    }

}
