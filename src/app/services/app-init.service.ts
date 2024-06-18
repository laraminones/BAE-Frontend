import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observer } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppInitService {
  constructor(private http: HttpClient) { }

  init(): Promise<any> {
    return new Promise((resolve, reject) => {
        const obs: Observer<any> = {
            next: ((config) => {
                // Load dynamic environment data
                environment.SIOP_INFO = config.siop;
                environment.CHAT_API = config.chat;
                environment.MATOMO_SITE_ID = config.matomoId;
                environment.MATOMO_TRACKER_URL = config.matomoUrl;
                environment.KNOWLEDGE_BASE_URL = config.knowledgeBaseUrl;
                environment.TICKETING_SYSTEM_URL = config.ticketingUrl;
                resolve(config);
            }),
            error: (error) => {
                reject(error);
            },
            complete: () => {}
        }
        this.http.get<any>(`${environment.BASE_URL}/config`).subscribe(obs);
    });
  }
}