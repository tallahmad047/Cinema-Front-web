import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  getProjections(salle: any) {
    //throw new Error('Method not implemented.');
    //return this.http.get(salle._links.projections.href);
    let url = salle._links.projections.href
    .replace("{?projection}","");
    return this.http.get(url +"?projection=p1");

  }
  public  host:string="http://localhost:8787";

  constructor(private http:HttpClient) { }
  public getVillles(){
    return this.http.get(this.host+"/villes");

  }

  getcinemas(v: any) {
     return this.http.get(v._links.cinemas.href);


  }
  getsalles(c:any){
    return this.http.get(c._links.salles.href);
  }

  getTicketsPlaces(p: any) {
    let url = p._links.tickets.href
        .replace("{?projection}","");
    return this.http.get(url +"?projection=ticketProj");

  }
  payerTickets(dataForm :any){

     return  this.http.post(this.host+"/payerTickets",dataForm);
  }
}
