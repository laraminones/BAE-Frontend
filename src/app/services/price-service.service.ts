import { Injectable } from '@angular/core';
import {components} from "../models/product-catalog";
import {TYPES} from "../models/types.const"
type ProductOffering = components["schemas"]["ProductOffering"];

@Injectable({
  providedIn: 'root'
})
export class PriceServiceService {

  constructor() { }

  formatCheapestPricePlan(prod:ProductOffering|undefined) {
    var result = {},
    pricePlan = null,
    pricePlans = [];
    if(prod!= undefined){
      if(prod.productOfferingPrice){
        if(prod.productOfferingPrice.length==1 && prod.productOfferingPrice[0].name?.toLocaleLowerCase() == 'open' && prod.productOfferingPrice[0].price?.value == 0){
          result = {
            'priceType': prod.productOfferingPrice[0].priceType,
            'price': prod.productOfferingPrice?.at(0)?.price?.value,
            'unit': prod.productOfferingPrice?.at(0)?.price?.unit,
            'text': 'open'
          }
          return result
        } else if (prod.productOfferingPrice.length > 0){
          pricePlans = prod.productOfferingPrice.filter(p => p.priceType === TYPES.PRICE.ONE_TIME);
  
          if (pricePlans.length > 0) {
            //One time price plans
              for (var i = 0; i < pricePlans.length; i++) {
                  if (pricePlan == null || Number(pricePlan.price?.value) > Number(pricePlans[i].price?.value)){
                    pricePlan = prod.productOfferingPrice[i];
                  }
              }
              result = {
                'priceType': pricePlan?.priceType,
                'price': pricePlan?.price?.value,
                'unit': pricePlan?.price?.unit,
                'text': 'one time'
              }
          } else {
              pricePlans = prod.productOfferingPrice.filter(function(pricePlan) {
                if(pricePlan.priceType !== undefined){
                  return (
                    [TYPES.PRICE.RECURRING, TYPES.PRICE.USAGE].indexOf(
                      pricePlan.priceType?.toLocaleLowerCase()
                    ) !== -1
                  );
                } else {
                  return ''
                }
              });
              result = {
                'priceType': pricePlans[0]?.priceType,
                'price': pricePlans[0]?.price?.value,
                'unit': pricePlans[0]?.price?.unit,
                'text': pricePlans[0]?.priceType?.toLocaleLowerCase() == TYPES.PRICE.RECURRING ? pricePlans[0]?.recurringChargePeriodType : pricePlans[0]?.priceType?.toLocaleLowerCase() == TYPES.PRICE.USAGE ? '/ '+ pricePlans[0]?.unitOfMeasure?.units : ''         
              }
          }
        } else {
          result = {
            'priceType': 'Free',
            'price': 0,
            'unit': null,
            'text': ''
          }        
        }
      }
    }
    return result;
  }

  getFormattedPriceList(prod:ProductOffering|undefined){
    let result = [];
    if(prod != undefined && prod.productOfferingPrice != undefined) {
      for(let i = 0; i< prod.productOfferingPrice?.length; i++){
        result.push({
          'priceType': prod.productOfferingPrice[i]?.priceType,
          'price': prod.productOfferingPrice[i]?.price?.value,
          'unit': prod.productOfferingPrice[i]?.price?.unit,
          'text': prod.productOfferingPrice[i]?.priceType?.toLocaleLowerCase() == TYPES.PRICE.RECURRING ? prod.productOfferingPrice[i]?.recurringChargePeriodType : prod.productOfferingPrice[i]?.priceType?.toLocaleLowerCase() == TYPES.PRICE.USAGE ? '/ '+ prod.productOfferingPrice[i]?.unitOfMeasure?.units : ''         
        })
      }
    }
    return result;
  }
}
