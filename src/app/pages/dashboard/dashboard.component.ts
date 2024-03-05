import {Component, OnInit} from '@angular/core';
import {EventMessageService} from "../../services/event-message.service";
import {LocalStorageService} from "../../services/local-storage.service";
import { ApiServiceService } from 'src/app/services/api-service.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { LoginInfo } from 'src/app/models/interfaces';
import * as moment from 'moment';
import { interval, Subscription} from 'rxjs';
import { RefreshLoginServiceService } from "src/app/services/refresh-login-service.service"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  isFilterPanelShown = false;
  //loginSubscription: Subscription = new Subscription();;
  constructor(private localStorage: LocalStorageService,
              private eventMessage: EventMessageService,
              private route: ActivatedRoute,
              private router: Router,
              private api: ApiServiceService,
              private refreshApi: RefreshLoginServiceService) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'FilterShown') {
        this.isFilterPanelShown = ev.value as boolean;
      }
    })
  }

  async ngOnInit() {
    this.isFilterPanelShown = JSON.parse(this.localStorage.getItem('is_filter_panel_shown') as string);
    //this.route.snapshot.paramMap.get('id');
    console.log('--- route data')
    console.log(this.route.queryParams)
    console.log(this.route.snapshot.queryParamMap.get('token'))
    if(this.route.snapshot.queryParamMap.get('token') != null){    
      this.api.getLogin(this.route.snapshot.queryParamMap.get('token')).then(data => {
        console.log('---- loginangular response ----')
        console.log(data)
        console.log(data.username)
        let info = {"id": data.id, "user": data.username, "email": data.email, "token": data.accessToken, "expire": data.expire } as LoginInfo;
        this.localStorage.addLoginInfo(info);
        this.eventMessage.emitLogin(info);
        console.log('----')
        //this.refreshApi.stopInterval();
        //this.refreshApi.startInterval(((data.expire - moment().unix())-4)*1000, data);
        //this.refreshApi.startInterval(3000, data);
      })      
      this.router.navigate(['/dashboard'])
    } else {
      console.log('sin token')
      //this.localStorage.clear()
      let aux =this.localStorage.getObject('login_items') as LoginInfo;
      if (JSON.stringify(aux) != '{}') {
        console.log(aux)
        console.log('moment')
        console.log(aux['expire'])
        console.log(moment().unix())
        console.log(aux['expire'] - moment().unix())
        console.log(aux['expire'] - moment().unix() <= 5)
      }
    }
    console.log('----')
    /*await this.api.getShoppingCart().then(data => {
      console.log('carrito')
      console.log(data)
    })*/
  }

}
