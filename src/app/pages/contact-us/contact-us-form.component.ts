import {Component, HostListener, OnInit, ChangeDetectorRef} from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import {faHandsHoldingHeart} from "@fortawesome/pro-solid-svg-icons";

@Component({
  selector: 'app-contact-us-form',
  templateUrl: './contact-us-form.component.html',
  styleUrl: './contact-us-form.component.css'
})

export class ContactUsFormComponent implements OnInit {
  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.maxLength(320)]),
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    lastname: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    organization: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    role: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    message: new FormControl('', [Validators.required]),
  });

  protected readonly faHandsHoldingHeart = faHandsHoldingHeart;

  dataControllerDome:any='https://dome-project.eu/about/#partners';
  DPA:any='https://dome-marketplace-sbx.org/assets/documents/privacy.pdf';
  showThanksMessage:boolean=false;
  
  ngOnInit() {
  }

  sendMail() {
    let message = 'First name: '+this.contactForm.value.name+ '%0A' +
    'Last name: '+this.contactForm.value.lastname+ '%0A' +
    'Email: '+this.contactForm.value.email+ '%0A' +
    'Organization: '+this.contactForm.value.organization+ '%0A' +
    'Role: '+this.contactForm.value.role+ '%0A'+
    this.contactForm.value.message;

    const mailtoLink = `mailto:info@dome-marketplace.eu?body=${message}`;
    
    this.showThanksMessage=true;
    // Open the mailto link
    window.location.href = mailtoLink;
    this.resetContactForm();
  }

  hide(){
    this.showThanksMessage=false;
  }
  resetContactForm(): void {
    this.contactForm.reset();
  
    Object.values(this.contactForm.controls).forEach(control => {
      control.setErrors(null); // clear errors
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    });
  }
  
}
