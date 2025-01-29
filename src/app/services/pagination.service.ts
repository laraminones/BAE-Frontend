import { Injectable } from '@angular/core';
import { Category } from '../models/interfaces';
import { ApiServiceService } from 'src/app/services/product-service.service';
import { AccountServiceService } from 'src/app/services/account-service.service';
import { ProductOrderService } from 'src/app/services/product-order-service.service';
import { ProductInventoryServiceService } from 'src/app/services/product-inventory-service.service';
import { environment } from 'src/environments/environment';
import {components} from "../models/product-catalog";
type ProductOffering = components["schemas"]["ProductOffering"];

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  PRODUCT_LIMIT: number = environment.PRODUCT_LIMIT;
  CATALOG_LIMIT: number = environment.CATALOG_LIMIT;

  constructor(
    private api: ApiServiceService,
    private accountService: AccountServiceService,
    private orderService: ProductOrderService,
    private inventoryService: ProductInventoryServiceService
  ) { }

  async getItemsPaginated(page:number, pageSize:any, next:boolean, items:any[], nextItems:any[], options:any,
    handler: (...params: any[]) => Promise<any>): Promise<any> {

      console.log('options')
      console.log(options)

    try {
      let params: any[] = [page];
      if("keywords" in options){
        params.push(options.keywords)
      }

      if("filters" in options){
        params.push(options.filters)
      }
      if("partyId" in options){
        params.push(options.partyId.toString())
      }
      if("catalogId" in options){
        params.push(options.catalogId.toString())
      }
      if("sort" in options){
        params.push(options.sort)
      }
      if("isBundle" in options){
        params.push(options.isBundle)
      }
      if("selectedDate" in options){
        params.push(options.selectedDate)
      }
      if("orders" in options){
        params.push(options.orders)
      }
      if("role" in options){
        params.push(options.role)
      }

      if(next == false){
        items=[];
        nextItems=[];
        page=0;
        params[0]=page;

        console.log(params)
        let data = await handler(...params)
        items=data;
        page=page+pageSize;

      } else {
        for(let i=0; i<nextItems.length; i++){
          items.push(nextItems[i])
        }
      }

      params[0]=page;
      let data = await handler(...params)
      nextItems = data;
      page=page+pageSize;

    } catch(err) {
      console.log(err)
    } finally {
      let page_check=true;
      if(nextItems.length>0){
        page_check=true;
      } else {
        page_check=false;
      }

      let info = {
        "page": page,
        "items": items,
        "nextItems": nextItems,
        "page_check": page_check
      }

      return info
    }
  }

  async getProducts(page:number,keywords:any,filters?:Category[]): Promise<ProductOffering[]> {
    let products:ProductOffering[]=[];
    try{
      if(filters)
      if(filters.length == 0){
        let data = await this.api.getProducts(page,keywords)
        //GET PRODUCT INNER INFO
        for(let i=0; i < data.length; i++){
            let attachment: any[]= []
            let spec = await this.api.getProductSpecification(data[i].productSpecification.id)
            attachment = spec.attachment
            let prodPrices: any[] | undefined= data[i].productOfferingPrice;
            let prices: any[]=[];
            if(prodPrices!== undefined){
              if(prodPrices.length>0){
                for(let j=0; j < prodPrices.length; j++){
                  let price = await this.api.getProductPrice(prodPrices[j].id)
                  prices.push(price);
                  if(j+1==prodPrices?.length){
                    products.push(
                      {
                        id: data[i].id,
                        name: data[i].name,
                        category: data[i].category,
                        description: data[i].description,
                        lastUpdate: data[i].lastUpdate,
                        attachment: attachment,
                        productOfferingPrice: prices,
                        productSpecification: data[i].productSpecification,
                        productOfferingTerm: data[i].productOfferingTerm,
                        version: data[i].version
                      }
                    )
                  }
                }
              } else {
                products.push(
                  {
                    id: data[i].id,
                    name: data[i].name,
                    category: data[i].category,
                    description: data[i].description,
                    lastUpdate: data[i].lastUpdate,
                    attachment: attachment,
                    productOfferingPrice: prices,
                    productSpecification: data[i].productSpecification,
                    productOfferingTerm: data[i].productOfferingTerm,
                    version: data[i].version
                  }
                )
              }
            } else {
              products.push(
                {
                  id: data[i].id,
                  name: data[i].name,
                  category: data[i].category,
                  description: data[i].description,
                  lastUpdate: data[i].lastUpdate,
                  attachment: attachment,
                  productOfferingPrice: prices,
                  productSpecification: data[i].productSpecification,
                  productOfferingTerm: data[i].productOfferingTerm,
                  version: data[i].version
                }
              )
            }
          }
      } else {
        let data = await this.api.getProductsByCategory(filters,page,keywords)
          for(let i=0; i < data.length; i++){
            let attachment: any[]= []
            let spec = await this.api.getProductSpecification(data[i].productSpecification.id)
            attachment = spec.attachment
            let prodPrices: any[] | undefined= data[i].productOfferingPrice;
            let prices: any[]=[];
            if(prodPrices!== undefined){
              if(prodPrices.length>0){
                for(let j=0; j < prodPrices.length; j++){
                  let price = await this.api.getProductPrice(prodPrices[j].id)
                  prices.push(price);
                  if(j+1==prodPrices?.length){
                    products.push(
                      {
                        id: data[i].id,
                        name: data[i].name,
                        category: data[i].category,
                        description: data[i].description,
                        lastUpdate: data[i].lastUpdate,
                        attachment: attachment,
                        productOfferingPrice: prices,
                        productSpecification: data[i].productSpecification,
                        productOfferingTerm: data[i].productOfferingTerm,
                        version: data[i].version
                      }
                    )
                  }
                }
              } else {
                products.push(
                  {
                    id: data[i].id,
                    name: data[i].name,
                    category: data[i].category,
                    description: data[i].description,
                    lastUpdate: data[i].lastUpdate,
                    attachment: attachment,
                    productOfferingPrice: prices,
                    productSpecification: data[i].productSpecification,
                    productOfferingTerm: data[i].productOfferingTerm,
                    version: data[i].version
                  }
                )
              }
            } else {
              products.push(
                {
                  id: data[i].id,
                  name: data[i].name,
                  category: data[i].category,
                  description: data[i].description,
                  lastUpdate: data[i].lastUpdate,
                  attachment: attachment,
                  productOfferingPrice: prices,
                  productSpecification: data[i].productSpecification,
                  productOfferingTerm: data[i].productOfferingTerm,
                  version: data[i].version
                }
              )
          }
        }
      }
    } finally {
      return products
    }
  }

  async getProductsByCatalog(page:number,keywords:any,filters?:Category[],id?:any): Promise<ProductOffering[]> {
    let products:ProductOffering[]=[];
    try{
      if(filters)
      if(filters.length == 0){
        let data = await this.api.getProductsByCatalog(id,page)
        for(let i=0; i < data.length; i++){
            let attachment: any[]= []
            let spec = await this.api.getProductSpecification(data[i].productSpecification.id)
            attachment = spec.attachment
            let prodPrices: any[] | undefined= data[i].productOfferingPrice;
            let prices: any[]=[];
            if(prodPrices!== undefined){
              if(prodPrices.length>0){
                for(let j=0; j < prodPrices.length; j++){
                  let price = await this.api.getProductPrice(prodPrices[j].id)
                  prices.push(price);
                  if(j+1==prodPrices?.length){
                    products.push(
                      {
                        id: data[i].id,
                        name: data[i].name,
                        category: data[i].category,
                        description: data[i].description,
                        lastUpdate: data[i].lastUpdate,
                        attachment: attachment,
                        productOfferingPrice: prices,
                        productSpecification: data[i].productSpecification,
                        productOfferingTerm: data[i].productOfferingTerm,
                        version: data[i].version
                      }
                    )
                  }
                }
              } else {
                products.push(
                  {
                    id: data[i].id,
                    name: data[i].name,
                    category: data[i].category,
                    description: data[i].description,
                    lastUpdate: data[i].lastUpdate,
                    attachment: attachment,
                    productOfferingPrice: prices,
                    productSpecification: data[i].productSpecification,
                    productOfferingTerm: data[i].productOfferingTerm,
                    version: data[i].version
                  })
              }
            } else {
              products.push(
                {
                  id: data[i].id,
                  name: data[i].name,
                  category: data[i].category,
                  description: data[i].description,
                  lastUpdate: data[i].lastUpdate,
                  attachment: attachment,
                  productOfferingPrice: prices,
                  productSpecification: data[i].productSpecification,
                  productOfferingTerm: data[i].productOfferingTerm,
                  version: data[i].version
                }
              )
            }
        }
      } else {
        let data = await this.api.getProductsByCategoryAndCatalog(filters,id,page)
        for(let i=0; i < data.length; i++){
          let attachment: any[]= []
          let spec = await this.api.getProductSpecification(data[i].productSpecification.id)
          attachment = spec.attachment
          let prodPrices: any[] | undefined= data[i].productOfferingPrice;
          let prices: any[]=[];
          if(prodPrices!== undefined){
            if(prodPrices.length>0){
              for(let j=0; j < prodPrices.length; j++){
                let price = await this.api.getProductPrice(prodPrices[j].id)
                prices.push(price);
                if(j+1==prodPrices?.length){
                  products.push(
                    {
                      id: data[i].id,
                      name: data[i].name,
                      category: data[i].category,
                      description: data[i].description,
                      lastUpdate: data[i].lastUpdate,
                      attachment: attachment,
                      productOfferingPrice: prices,
                      productSpecification: data[i].productSpecification,
                      productOfferingTerm: data[i].productOfferingTerm,
                      version: data[i].version
                    }
                  )
                }
              }
            } else {
              products.push(
                {
                  id: data[i].id,
                  name: data[i].name,
                  category: data[i].category,
                  description: data[i].description,
                  lastUpdate: data[i].lastUpdate,
                  attachment: attachment,
                  productOfferingPrice: prices,
                  productSpecification: data[i].productSpecification,
                  productOfferingTerm: data[i].productOfferingTerm,
                  version: data[i].version
                }
              )
            }
          } else {
            products.push(
              {
                id: data[i].id,
                name: data[i].name,
                category: data[i].category,
                description: data[i].description,
                lastUpdate: data[i].lastUpdate,
                attachment: attachment,
                productOfferingPrice: prices,
                productSpecification: data[i].productSpecification,
                productOfferingTerm: data[i].productOfferingTerm,
                version: data[i].version
              }
            )
          }
        }
      }
    } catch (err) {
      console.log(err)
    } finally {
      return products
    }
  }

  /*
  async getOrders(page:number,filters:Category[],partyId:any,selectedDate:any,orders:any[],role:any): Promise<any[]> {
    try{
      orders = await this.orderService.getProductOrders(partyId,page,filters,selectedDate,role)
      for(let i=0;i<orders.length;i++){
        let items:any[] = [];
        let bill = await this.accountService.getBillingAccountById(orders[i].billingAccount.id)
        for(let j=0;j<orders[i].productOrderItem.length;j++){
          let item = await this.api.getProductById(orders[i].productOrderItem[j].id)
          let spec  = await this.api.getProductSpecification(item.productSpecification.id)
          if(item.productOfferingPrice == undefined ||  item.productOfferingPrice.length == 0){
            items.push({
              id: item.id,
              name: item.name,
              category: item.category,
              description: item.description,
              lastUpdate: item.lastUpdate,
              attachment: spec.attachment,
              productSpecification: item.productSpecification,
              productOfferingTerm: item.productOfferingTerm,
              version: item.version
            })
          } else {
            let prodprice = await this.api.getProductPrice(item.productOfferingPrice[0].id)
            items.push({
              id: item.id,
              name: item.name,
              category: item.category,
              description: item.description,
              lastUpdate: item.lastUpdate,
              attachment: spec.attachment,
              productOfferingPrice: {
                "price": prodprice.price.value,
                "unit": prodprice.price.unit,
                "priceType": prodprice.priceType,
                "text": prodprice.unitOfMeasure != undefined ? '/'+prodprice.unitOfMeasure.units : prodprice.recurringChargePeriodType
              },
              productSpecification: item.productSpecification,
              productOfferingTerm: item.productOfferingTerm,
              version: item.version
            })
          }
        }
        orders[i]['billingAccount']=bill;
        orders[i].productOrderItem=items;
      }
    } finally {
      console.log('finally')
      console.log(orders)
      return orders
    }
  } */
  async getOrders(page: number, filters: Category[], partyId: any, selectedDate: any, orders: any[], role: any): Promise<any[]> {
    try {
      // Obtener pedidos
      orders = await this.orderService.getProductOrders(partyId, page, filters, selectedDate, role);

      // Obtener todas las cuentas de facturación en paralelo
      const billingAccounts = await Promise.all(orders.map(order => this.accountService.getBillingAccountById(order.billingAccount.id)));

      // Procesar los pedidos en paralelo
      const ordersWithDetails = await Promise.all(orders.map(async (order, i) => {
        // Obtener detalles de los productos en paralelo
        const items = await Promise.all(order.productOrderItem.map(async (productOrderItem:any) => {
          try {
            const offer = await this.api.getProductById(productOrderItem.productOffering.id);
            const spec = await this.api.getProductSpecification(offer.productSpecification.id);

            if (!offer.productOfferingPrice || offer.productOfferingPrice.length === 0) {
              return {
                id: offer.id,
                name: offer.name,
                category: offer.category,
                description: offer.description,
                lastUpdate: offer.lastUpdate,
                attachment: spec.attachment,
                productSpecification: offer.productSpecification,
                productOfferingTerm: offer.productOfferingTerm,
                version: offer.version
              };
            }

            let result: any = {}
            result = {
              id: offer.id,
              name: offer.name,
              category: offer.category,
              description: offer.description,
              lastUpdate: offer.lastUpdate,
              attachment: spec.attachment,
              productSpecification: offer.productSpecification,
              productOfferingTerm: offer.productOfferingTerm,
              version: offer.version,
            };

            if(offer.productOfferingPrice?.[0]) {
              const prodprice = await this.api.getProductPrice(offer.productOfferingPrice[0].id);
              result['productOfferingPrice'] = prodprice
              if(prodprice.priceType) result['priceType'] = prodprice.priceType;
            }
            return result;
          } catch (error) {
            console.error(`Error fetching product details for ${productOrderItem.id}:`, error);
            return null; // Manejo de errores sin detener toda la ejecución
          }
        }));

        return {
          ...order,
          billingAccount: billingAccounts[i],
          productOrderItem: items.filter(Boolean) // Filtra productos nulos en caso de error
        };
      }));

      console.log('Orders processed:', ordersWithDetails);
      return ordersWithDetails;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  /*
  async getOffers(inventory:any[]): Promise<any[]> {
    try{
      for(let i=0; i<inventory.length; i++){
        let prod = await this.api.getProductById(inventory[i].productOffering.id)
          let attachment: any[]= []
          let spec = await this.api.getProductSpecification(prod.productSpecification.id)
            if(spec.attachment){
              attachment = spec.attachment
            }
            inventory[i]['product'] = {
              id: inventory[i].id,
              name: prod.name,
              category: prod.category,
              description: prod.description,
              lastUpdate: prod.lastUpdate,
              attachment: attachment,
              productSpecification: prod.productSpecification,
              productOfferingTerm: prod.productOfferingTerm,
              version: prod.version
            };

            if(inventory[i].productPrice){
              if(inventory[i].productPrice.length>0){
                inventory[i]['price']={
                  "price": inventory[i].productPrice[0].price.taxIncludedAmount.value,
                  "unit": inventory[i].productPrice[0].price.taxIncludedAmount.unit,
                  "priceType": inventory[i].productPrice[0].priceType,
                  "text": inventory[i].productPrice[0].unitOfMeasure != undefined ? '/'+inventory[i].productPrice[0].unitOfMeasure : inventory[i].productPrice[0].recurringChargePeriodType
                }
              } else {
                if(prod.productOfferingPrice){
                  if(prod.productOfferingPrice.length==1){
                    let price = await this.api.getProductPrice(prod.productOfferingPrice[0].id)
                      console.log(price)
                      inventory[i]['price']={
                        "price": '',
                        "unit": '',
                        "priceType": price.priceType,
                        "text": ''
                      }
                  }
                }
              }
            }
      }
    } finally {
      return inventory
    }
  } */

  async getOffers(inventory: any[]): Promise<any[]> {
    try {
      // Procesar todos los elementos de inventory en paralelo
      const updatedInventory = await Promise.all(inventory.map(async (item) => {
        try {
          // Obtener producto y especificación en paralelo
          const [prod, spec] = await Promise.all([
            this.api.getProductById(item.productOffering.id),
            this.api.getProductSpecification(item.productOffering.id)
          ]);

          // Construcción de attachments
          const attachment = spec?.attachment ?? [];

          // Construcción de producto
          const productDetails = {
            id: item.id,
            name: prod.name,
            category: prod.category,
            description: prod.description,
            lastUpdate: prod.lastUpdate,
            attachment,
            productSpecification: prod.productSpecification,
            productOfferingTerm: prod.productOfferingTerm,
            version: prod.version
          };

          // Construcción de precio
          let priceDetails = null;

          if (item.productPrice?.length > 0) {
            const price = item.productPrice[0].price.taxIncludedAmount;
            priceDetails = {
              price: price.value,
              unit: price.unit,
              priceType: item.productPrice[0].priceType,
              text: item.productPrice[0].unitOfMeasure ? `/${item.productPrice[0].unitOfMeasure}` : item.productPrice[0].recurringChargePeriodType
            };
          } else if (prod.productOfferingPrice?.length === 1) {
            const priceData = await this.api.getProductPrice(prod.productOfferingPrice[0].id);
            console.log(priceData);
            priceDetails = {
              price: '',
              unit: '',
              priceType: priceData.priceType,
              text: ''
            };
          }

          return { ...item, product: productDetails, price: priceDetails };

        } catch (error) {
          console.error(`Error processing item ${item.id}:`, error);
          return item; // Retorna el item sin modificaciones en caso de error
        }
      }));

      return updatedInventory;

    } catch (error) {
      console.error('Error fetching offers:', error);
      return [];
    }
  }


  async getInventory(page:number,keywords:any,filters:Category[],partyId:any): Promise<any[]>{
    let inv:any[]=[]
    try {
      let data = await this.inventoryService.getInventory(page,partyId,filters,keywords)
      console.log('inv request')
      console.log(data)
      inv = await this.getOffers(data);
    } finally {
      return inv
    }
  }
}
