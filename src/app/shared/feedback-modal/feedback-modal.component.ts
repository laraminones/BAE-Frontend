import { Component, HostListener } from '@angular/core';
import {faMessagePen, faHandsHoldingHeart} from "@fortawesome/pro-solid-svg-icons";
import {EventMessageService} from "../../services/event-message.service";

@Component({
  selector: 'feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrl: './feedback-modal.component.css'
})
export class FeedbackModalComponent {
  constructor(
    private eventMessage: EventMessageService
  ) {  }
  protected readonly faMessagePen = faMessagePen;
  protected readonly faHandsHoldingHeart = faHandsHoldingHeart;
  rating: number = 0; // Current rating
  addComment:boolean=false;
  showThanksMessage:boolean=false;

  @HostListener('document:click')
  onClick() {
    this.eventMessage.emitCloseFeedback(true);
  }

  setRating(star: number) {
    this.rating = star;
  }

  next(){
    if(this.addComment==false){
      this.addComment=true;
    } else {
      let body:any = {
        "rating": this.rating,
      }
      if (document.getElementById("message") != null){
        body["description"] = (document.getElementById("message") as HTMLTextAreaElement)?.value
      }

      //TO-DO: CAMBIAR EL TIMEOUT POR LA LLAMADA AL ENDPOINT QUE GUARDE LOS DATOS
      setTimeout(() => {
        this.showThanksMessage=true;        
      }, 1000); 
    }
    
  }

  hide(){
    this.eventMessage.emitCloseFeedback(true);
  }

}
