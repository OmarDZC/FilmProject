using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json;

namespace PeliculasAPI.Utilidades
{
    public class TypeBinder : IModelBinder //trabaja el mapeo con tipos Binding
    {
        public Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var nombrePropiedad = bindingContext.ModelName; //obtener el nombre que se esta colocando el binder
            var valor = bindingContext.ValueProvider.GetValue(nombrePropiedad); //para obtener el valor

            if(valor == ValueProviderResult.None)
            {
                return Task.CompletedTask; 
            }
            try
            {
                var tipoDestino = bindingContext.ModelMetadata.ModelType;
                //pasar de json a obj
                var valorDeserializado = JsonSerializer.Deserialize(valor.FirstValue!,
                    tipoDestino, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                bindingContext.Result = ModelBindingResult.Success(valorDeserializado); //coger el string recibido y convertir al tipo de dato (en este caso List<int>)

            }
            catch
            {
                bindingContext.ModelState.TryAddModelError(nombrePropiedad, "El valor dado no es del tipo adecuado");
            }

            return Task.CompletedTask;
        }
    }
}
