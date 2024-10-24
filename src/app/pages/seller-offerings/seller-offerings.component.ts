import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import {faIdCard, faSort, faSwatchbook} from "@fortawesome/pro-solid-svg-icons";
import {components} from "src/app/models/product-catalog";
type Catalog = components["schemas"]["Catalog"];
import { environment } from 'src/environments/environment';
import { ApiServiceService } from 'src/app/services/product-service.service';
import {LocalStorageService} from "src/app/services/local-storage.service";
import { LoginInfo } from 'src/app/models/interfaces';
import { initFlowbite } from 'flowbite';
import {EventMessageService} from "../../services/event-message.service";

@Component({
  selector: 'app-seller-offerings',
  templateUrl: './seller-offerings.component.html',
  styleUrl: './seller-offerings.component.css'
})
export class SellerOfferingsComponent implements OnInit {

  show_catalogs: boolean = true;
  show_prod_specs: boolean = false;
  show_service_specs: boolean = false;
  show_resource_specs: boolean = false;
  show_offers: boolean = false;
  show_create_prod_spec: boolean = false;
  show_create_res_spec: boolean = false;
  show_create_serv_spec: boolean = false;
  show_create_offer: boolean = false;

  constructor(
    private localStorage: LocalStorageService,
    private cdr: ChangeDetectorRef,
    private eventMessage: EventMessageService
  ) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'SellerProductSpec' && ev.value == true) {        
        this.goToProdSpec();
      }
      if(ev.type === 'SellerCreateProductSpec' && ev.value == true) {
        this.goToCreateProdSpec();
      }
      if(ev.type === 'SellerServiceSpec' && ev.value == true) {        
        this.goToServiceSpec();
      }
      if(ev.type === 'SellerCreateServiceSpec' && ev.value == true) {
        this.goToCreateServSpec();
      }
      if(ev.type === 'SellerResourceSpec' && ev.value == true) {        
        this.goToResourceSpec();
      }
      if(ev.type === 'SellerCreateResourceSpec' && ev.value == true) {
        this.goToCreateResSpec();
      }
      if(ev.type === 'SellerOffer' && ev.value == true) {        
        this.goToOffers();
      }
      if(ev.type === 'SellerCreateOffer' && ev.value == true) {
        this.goToCreateOffer();
      }
    })
  }

  ngOnInit() {
    console.log('init')
  }

  goToCreateProdSpec(){
    this.show_catalogs=false;
    this.show_prod_specs=false;
    this.show_service_specs=false;
    this.show_resource_specs=false;
    this.show_offers=false;
    this.show_create_prod_spec=true;
    this.show_create_serv_spec=false;
    this.show_create_res_spec=false;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  goToCreateServSpec(){
    this.show_catalogs=false;
    this.show_prod_specs=false;
    this.show_service_specs=false;
    this.show_resource_specs=false;
    this.show_offers=false;
    this.show_create_serv_spec=true;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=false;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  goToCreateResSpec(){
    this.show_catalogs=false;
    this.show_prod_specs=false;
    this.show_service_specs=false;
    this.show_resource_specs=false;
    this.show_offers=false;
    this.show_create_serv_spec=false;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=true;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  goToCreateOffer(){
    this.show_catalogs=false;
    this.show_prod_specs=false;
    this.show_service_specs=false;
    this.show_resource_specs=false;
    this.show_offers=false;
    this.show_create_serv_spec=false;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=false;
    this.show_create_offer=true;
    this.cdr.detectChanges();
  }

  goToCatalogs(){
    this.selectCatalogs();
    this.show_catalogs=true;
    this.show_prod_specs=false;
    this.show_service_specs=false;
    this.show_resource_specs=false;
    this.show_offers=false;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=false;
    this.show_create_serv_spec=false;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  selectCatalogs(){
    let catalog_button = document.getElementById('catalogs-button')
    let prodSpec_button = document.getElementById('prod-spec-button')
    let serviceSpec_button = document.getElementById('sev-spec-button')
    let resourceSpec_button = document.getElementById('res-spec-button')
    let offer_button = document.getElementById('offers-button')

    this.selectMenu(catalog_button,'text-white bg-primary-100');
    this.unselectMenu(prodSpec_button,'text-white bg-primary-100');
    this.unselectMenu(serviceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(resourceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(offer_button,'text-white bg-primary-100');
  }

  goToProdSpec(){
    this.selectProdSpec();
    this.show_catalogs=false;
    this.show_prod_specs=true;
    this.show_service_specs=false;
    this.show_resource_specs=false;
    this.show_offers=false;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=false;
    this.show_create_serv_spec=false;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  selectProdSpec(){
    let catalog_button = document.getElementById('catalogs-button')
    let prodSpec_button = document.getElementById('prod-spec-button')
    let serviceSpec_button = document.getElementById('sev-spec-button')
    let resourceSpec_button = document.getElementById('res-spec-button')
    let offer_button = document.getElementById('offers-button')

    this.selectMenu(prodSpec_button,'text-white bg-primary-100');
    this.unselectMenu(catalog_button,'text-white bg-primary-100');
    this.unselectMenu(serviceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(resourceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(offer_button,'text-white bg-primary-100');
  }

  goToServiceSpec(){
    this.selectServiceSpec();
    this.show_catalogs=false;
    this.show_prod_specs=false;
    this.show_service_specs=true;
    this.show_resource_specs=false;
    this.show_offers=false;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=false;
    this.show_create_serv_spec=false;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  selectServiceSpec(){
    let catalog_button = document.getElementById('catalogs-button')
    let prodSpec_button = document.getElementById('prod-spec-button')
    let serviceSpec_button = document.getElementById('sev-spec-button')
    let resourceSpec_button = document.getElementById('res-spec-button')
    let offer_button = document.getElementById('offers-button')

    this.selectMenu(serviceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(catalog_button,'text-white bg-primary-100');
    this.unselectMenu(prodSpec_button,'text-white bg-primary-100');
    this.unselectMenu(resourceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(offer_button,'text-white bg-primary-100');
  }

  goToResourceSpec(){
    this.selectResourceSpec();
    this.show_catalogs=false;
    this.show_prod_specs=false;
    this.show_service_specs=false;
    this.show_resource_specs=true;
    this.show_offers=false;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=false;
    this.show_create_serv_spec=false;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  selectResourceSpec(){
    let catalog_button = document.getElementById('catalogs-button')
    let prodSpec_button = document.getElementById('prod-spec-button')
    let serviceSpec_button = document.getElementById('sev-spec-button')
    let resourceSpec_button = document.getElementById('res-spec-button')
    let offer_button = document.getElementById('offers-button')

    this.selectMenu(resourceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(catalog_button,'text-white bg-primary-100');
    this.unselectMenu(prodSpec_button,'text-white bg-primary-100');
    this.unselectMenu(serviceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(offer_button,'text-white bg-primary-100');
  }

  goToOffers(){
    this.selectOffers();
    this.show_catalogs=false;
    this.show_prod_specs=false;
    this.show_service_specs=false;
    this.show_resource_specs=false;
    this.show_offers=true;
    this.show_create_prod_spec=false;
    this.show_create_res_spec=false;
    this.show_create_serv_spec=false;
    this.show_create_offer=false;
    this.cdr.detectChanges();
  }

  selectOffers(){
    let catalog_button = document.getElementById('catalogs-button')
    let prodSpec_button = document.getElementById('prod-spec-button')
    let serviceSpec_button = document.getElementById('sev-spec-button')
    let resourceSpec_button = document.getElementById('res-spec-button')
    let offer_button = document.getElementById('offers-button')

    this.selectMenu(offer_button,'text-white bg-primary-100');
    this.unselectMenu(catalog_button,'text-white bg-primary-100');
    this.unselectMenu(prodSpec_button,'text-white bg-primary-100');
    this.unselectMenu(serviceSpec_button,'text-white bg-primary-100');
    this.unselectMenu(resourceSpec_button,'text-white bg-primary-100');
  }

  removeClass(elem: HTMLElement, cls:string) {
    var str = " " + elem.className + " ";
    elem.className = str.replace(" " + cls + " ", " ").replace(/^\s+|\s+$/g, "");
  }

  addClass(elem: HTMLElement, cls:string) {
      elem.className += (" " + cls);
  }

  unselectMenu(elem:HTMLElement | null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        this.removeClass(elem,cls)
      } else {
        console.log('already unselected')
      }
    }
  }

  selectMenu(elem:HTMLElement| null,cls:string){
    if(elem != null){
      if(elem.className.match(cls)){
        console.log('already selected')
      } else {
        this.addClass(elem,cls)
      }
    }
  }

}
