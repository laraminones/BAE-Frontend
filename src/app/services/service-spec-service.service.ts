import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Category, LoginInfo } from '../models/interfaces';
import { environment } from 'src/environments/environment';
import {components} from "../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];
import {LocalStorageService} from "./local-storage.service";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ServiceSpecServiceService {

  public static BASE_URL: String = environment.BASE_URL;
  public static API_PORT: Number = environment.API_PORT;
  public static SERVICE: String = environment.SERVICE;
  public static API_SERVICE_SPEC: String = environment.SERVICE_SPEC;
  public static SERV_SPEC_LIMIT: number = environment.SERV_SPEC_LIMIT;

  constructor(private http: HttpClient,private localStorage: LocalStorageService) { }

  getServiceSpecByUser(page:any,status:any[],partyId:any) {
    let url = `${ServiceSpecServiceService.BASE_URL}:${ServiceSpecServiceService.API_PORT}${ServiceSpecServiceService.SERVICE}${ServiceSpecServiceService.API_SERVICE_SPEC}?limit=${ServiceSpecServiceService.SERV_SPEC_LIMIT}&offset=${page}&relatedParty.id=${partyId}`;    

    let lifeStatus=''
    if(status.length>0){
      for(let i=0; i < status.length; i++){
        if(i==status.length-1){
          lifeStatus=lifeStatus+status[i]
        } else {
          lifeStatus=lifeStatus+status[i]+','
        }    
      }
      url=url+'&lifecycleStatus='+lifeStatus;
    }

    return lastValueFrom(this.http.get<any>(url));
  }
}
