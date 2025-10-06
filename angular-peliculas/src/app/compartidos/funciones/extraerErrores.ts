export function extraerErrores(obj: any) : string[] {
    //string[] porque pueden ser varios errores
    if (obj.error?.errors) {
        obj = obj.error; //porque mi Json pasa por error.errors
    } 
    const err = obj.errors;

    let mensajesDeError : string [] = [];

    for(let llave in err){
        let campo = llave;
        const mensajesConCampos = err[llave].map((mensaje : string) => `${campo}: ${mensaje}`);
        mensajesDeError = mensajesDeError.concat(mensajesConCampos);
    }
    return mensajesDeError;
}

export function extraerErroresIdentity(obj: any): string[] {
    let mensajesDeError: string[] = [];

    for (let i = 0; i < obj.error.length; i++) {
        const elemento = obj.error[i];
        mensajesDeError.push(elemento.description);
    }
    return mensajesDeError;
}