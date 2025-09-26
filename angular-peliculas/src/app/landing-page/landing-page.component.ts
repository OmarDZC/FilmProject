import { Component, OnInit } from '@angular/core';
import { ListadoPeliculasComponent } from "../peliculas/listado-peliculas/listado-peliculas.component";

@Component({
  selector: 'app-landing-page',
  imports: [ListadoPeliculasComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      this.peliculasEnCines = [
        {
          titulo: "Kimetsu no Yaiba",
          fechaSalida: new Date(),
          precio: 14,
          poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Kimetsu_no_Yaiba_logo.svg/250px-Kimetsu_no_Yaiba_logo.svg.png"
        },
        {
          titulo: "Naruto",
          fechaSalida: new Date("2025-12-03"),
          precio: 12,
          poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Naruto_logo.svg/250px-Naruto_logo.svg.png"
        },
        {
          titulo: "One Piece",
          fechaSalida: new Date("2027-01-11"),
          precio: 20,
          poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/One_piece_logo.svg/250px-One_piece_logo.svg.png"
        },
        {
          titulo: "Kaijuu n8",
          fechaSalida: new Date("2026-05-13"),
          precio: 17,
          poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/%E6%80%AA%E7%8D%A38%E5%8F%B7_logo_%281%29.svg/330px-%E6%80%AA%E7%8D%A38%E5%8F%B7_logo_%281%29.png"
        }
      ];
      this.peliculasProximosEstrenos = [
        {
          titulo: "Shingeki No Kyojin",
          fechaSalida: new Date("2027-10-01"),
          precio: 10.99,
          poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Attack_on_Titan_logo.svg/250px-Attack_on_Titan_logo.svg.png"
        },
        {
          titulo: "Pokemon 10",
          fechaSalida: new Date("2027-11-11"),
          precio: 15.99,
          poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/250px-International_Pok%C3%A9mon_logo.svg.png"
        }
      ]
    }, 100);
  }

  peliculasEnCines!: any[];
  peliculasProximosEstrenos!: any[];
}
