import {OnDestroy, OnInit, Component} from '@angular/core';
import { faLinkedin, faYoutube, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { ThemeService } from "../../services/theme.service";
import { NavLink } from "../../themes";


import {EventMessageService} from "../../services/event-message.service";

@Component({
  selector: 'bae-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  protected readonly faLinkedin = faLinkedin;
  protected readonly faYoutube = faYoutube;
  protected readonly faXTwitter = faXTwitter;

  // Propiedades dinámicas del tema
  public footerLinks: NavLink[] = [];
  public socialLinks: { icon: any; url: string | undefined; }[] = [];
  private themeSubscription: Subscription = new Subscription();

  feedback:boolean=false;

  constructor(private router: Router,
              private eventMessage: EventMessageService,
              private themeService: ThemeService) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'CloseFeedback') {
        this.feedback = false;
      }
    })
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      // Cargar enlaces del footer desde la configuración del tema
      this.footerLinks = theme?.links?.footerLinks || [];

      // Cargar y mapear redes sociales
      this.socialLinks = [];
      if (theme?.links?.linkedin) {
        this.socialLinks.push({ url: theme.links.linkedin, icon: this.faLinkedin });
      }
      if (theme?.links?.twitter) {
        this.socialLinks.push({ url: theme.links.twitter, icon: this.faXTwitter });
      }
      if (theme?.links?.youtube) {
        this.socialLinks.push({ url: theme.links.youtube, icon: this.faYoutube });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }


  goTo(path:string) {
    this.router.navigate([path]);
  }

  open(path:string){
    window.open(path, '_blank');
  }
}
