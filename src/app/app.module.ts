import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FeaturedComponent } from "./offerings/featured/featured.component";
import { GalleryComponent } from "./offerings/gallery/gallery.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { SearchComponent } from "./pages/search/search.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from '@angular/common/http';
import {CategoriesFilterComponent} from "./shared/categories-filter/categories-filter.component";
import {CardComponent} from "./shared/card/card.component";
import {BadgeComponent} from "./shared/badge/badge.component";
import { NgOptimizedImage } from '@angular/common';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryItemComponent} from "./shared/category-item/category-item.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SearchComponent,
    FeaturedComponent,
    GalleryComponent,
    CategoriesFilterComponent,
    CategoryItemComponent,
    CardComponent,
    BadgeComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    SharedModule,
    AppRoutingModule,
    NgOptimizedImage,  
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

