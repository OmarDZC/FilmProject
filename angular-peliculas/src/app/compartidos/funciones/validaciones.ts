import { AbstractControl, NgControl, ValidationErrors, ValidatorFn } from "@angular/forms";

//esta funcion va a su vez retornar otra funciona que se encargara de validar la funcion
export function primeraLetraMayuscula(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valor = <string>control.value; //se convierte en string
        if(!valor) return null;
        if(valor.length === 0) return null;

        const primeraLetra = valor[0];
        if(primeraLetra != primeraLetra.toUpperCase()){
            //si es NO ES mayuscula...
            return {
                primeraLetraMayuscula: {
                    mensaje: 'La primera letra debe ser mayúscula'
                }
            }
        }
        //si la primera letra ES mayuscula..
        return null;
    }
}

//funcion para que no se puede poner una fecha de nacimiento del futuro 
export function fechaNoPuedeSerFuturo(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const fechaEscogidaPorUsuario = new Date (control.value);
        const hoy = new Date();

        if(fechaEscogidaPorUsuario > hoy){
            return {
                futuro: {
                    mensaje: 'La fecha no puede ser del futuro'
                }
            }
        }
        return null;
    }
}