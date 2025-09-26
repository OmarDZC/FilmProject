export function toBase64(file: File): Promise<string> {
    //promise en promesa => programacion asincrona, que devolvera en el futuro en este caso un string
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.readAsDataURL(file); //para que lea el archivo
        //cuando termine de leer => le pasamos una f() => devolvera el resultado en string
        lector.onload = () => resolve(lector.result as string);
        lector.onerror = (error) => reject(error);
    })
}