import { HttpParams } from "@angular/common/http";

export function construirQueryParams(obj: any): HttpParams {
    let queryParams = new HttpParams();

    for(let propiedad in obj){
        //contruye los queryString con la propiedad y el objeto donde se encuentra
        if(obj.hasOwnProperty(propiedad)){
            queryParams = queryParams.append(propiedad, obj[propiedad]);
        }
    }
    return queryParams;
}