import { Component } from '@angular/core';
import {GalleryComponent} from "../../offerings/gallery/gallery.component";
import {FeaturedComponent} from "../../offerings/featured/featured.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GalleryComponent,FeaturedComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
