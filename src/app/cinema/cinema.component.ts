import { Component, OnInit } from '@angular/core';
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

public villes:any;
    public cinemas:any;
    public  currentvile:any;
    public  currentcinema:any;
    public salles:any
    public currentProjection:any;
    public tickets:any;
    public onSelecTickets:any;
  constructor( public cinemaservice:CinemaService) { }

  ngOnInit(): void {

    this.cinemaservice.getVillles()
        .subscribe(data =>{
                this.villes = data;

            },
            error => {
                console.log(error);

            })
  }

    onGetCinemas(v: any) {


        this.currentvile=v;
        this.salles= undefined;
      this.cinemaservice.getcinemas(v).subscribe(data=>{
          this.cinemas=data;

      },error => {
          console.log(error);

      })

    }
    onGetSalles(c:any){
   this.currentcinema=c;
   this.cinemaservice.getsalles(c)
   .subscribe(data=>{
       this.salles=data;
       this.salles._embedded.salles.forEach(
         (         salle: { projections: Object; })=>{
           this.cinemaservice.getProjections(salle)
          .subscribe (data=>{
            salle.projections=data;

        },(error: any) => {
            console.log(error);

        })



         })

           },error => {
                   console.log(error);

                  })

   }

    onGetTicketsPlaces(p:any) {
        this.currentProjection=p;
        //console.log(p);
        this.cinemaservice.getTicketsPlaces(p)
            .subscribe((data) =>{
            this.currentProjection.tickets=data;
            this.onSelecTickets=[];

        },(error: any) => {
            console.log(error);

        })





    }
    onSelecTicket(t:any){
     if(!t.selected){
       t.selected=true;
       this.onSelecTickets.push(t);
     }else{
      t.selected=false;
      this.onSelecTickets.splice(this.onSelecTickets.indexOf(t),1);

     }


    }
    getTicketClass(t:any){
      let str="btn ticket ";
      if(t.reserve==true){
        str+="btn-danger";

      }else if(t.selected){
        str+="btn-warning";

      }else{
        str+="btn-success";
      }
      return str;

    }

  onPaysTickets(dataform: any) {

    let tickets: any[];
    tickets = [];
    // @ts-ignore
    this.onSelecTickets.forEach(t=>{
      tickets.push(t.id);
    });
    dataform.tickets=tickets;

    this.cinemaservice.payerTickets(dataform).
    subscribe((data: any) =>{
      alert("Ticket reserve avec succes");
      this.onGetTicketsPlaces(this.currentProjection);

    },(error: any) => {
      console.log(error);

    })


  }
}
