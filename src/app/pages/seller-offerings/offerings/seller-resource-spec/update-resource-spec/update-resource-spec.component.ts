import { Component, Input, OnInit, ChangeDetectorRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {LocalStorageService} from "src/app/services/local-storage.service";
import {EventMessageService} from "src/app/services/event-message.service";
import { ResourceSpecServiceService } from 'src/app/services/resource-spec-service.service';
import { LoginInfo } from 'src/app/models/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { noWhitespaceValidator } from 'src/app/validators/validators';

import {components} from "src/app/models/resource-catalog";
type ResourceSpecification_Update = components["schemas"]["ResourceSpecification_Update"];
type CharacteristicValueSpecification = components["schemas"]["ResourceSpecificationCharacteristicValue"];
type ResourceSpecificationCharacteristic = components["schemas"]["ResourceSpecificationCharacteristic"];

@Component({
  selector: 'update-resource-spec',
  templateUrl: './update-resource-spec.component.html',
  styleUrl: './update-resource-spec.component.css'
})
export class UpdateResourceSpecComponent implements OnInit {
  @Input() res: any;

  partyId:any='';

  resourceToUpdate:ResourceSpecification_Update | undefined;

  stepsElements:string[]=['general-info','chars','summary'];
  stepsCircles:string[]=['general-circle','chars-circle','summary-circle'];

  //markdown variables:
  showPreview:boolean=false;
  showEmoji:boolean=false;
  description:string='';  

  //CONTROL VARIABLES:
  showGeneral:boolean=true;
  showChars:boolean=false;
  showSummary:boolean=false;

  //SERVICE GENERAL INFO:
  generalForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
    description: new FormControl('', Validators.maxLength(100000)),
  });
  resStatus:any;

  //CHARS INFO
  charsForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
    description: new FormControl('')
  });
  stringCharSelected:boolean=true;
  numberCharSelected:boolean=false;
  rangeCharSelected:boolean=false;
  prodChars:ResourceSpecificationCharacteristic[]=[];
  creatingChars:CharacteristicValueSpecification[]=[];
  showCreateChar:boolean=false;

  errorMessage:any='';
  showError:boolean=false;

  //CHARS
  stringValue: string = '';
  numberValue: string = '';
  numberUnit: string = '';
  fromValue: string = '';
  toValue: string = '';
  rangeUnit: string = '';

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private elementRef: ElementRef,
    private resSpecService: ResourceSpecServiceService,
  ) {
    this.eventMessage.messages$.subscribe(ev => {
      if(ev.type === 'ChangedSession') {
        this.initPartyInfo();
      }
    })
  }

  @HostListener('document:click')
  onClick() {
    if(this.showEmoji==true){
      this.showEmoji=false;
      this.cdr.detectChanges();
    }
  }

  ngOnInit() {
    this.initPartyInfo();
    console.log(this.res)
    this.populateResInfo();
  }

  initPartyInfo(){
    let aux = this.localStorage.getObject('login_items') as LoginInfo;
    if(JSON.stringify(aux) != '{}' && (((aux.expire - moment().unix())-4) > 0)) {
      if(aux.logged_as==aux.id){
        this.partyId = aux.partyId;
      } else {
        let loggedOrg = aux.organizations.find((element: { id: any; }) => element.id == aux.logged_as)
        this.partyId = loggedOrg.partyId
      }
    }
  }

  populateResInfo(){
    //GENERAL INFORMATION
    this.generalForm.controls['name'].setValue(this.res.name);
    this.generalForm.controls['description'].setValue(this.res.description);
    this.resStatus=this.res.lifecycleStatus;

    //CHARS
    this.prodChars=this.res.resourceSpecCharacteristic;
  }

  goBack() {
    this.eventMessage.emitSellerResourceSpec(true);
  }

  setResStatus(status:any){
    this.resStatus=status;
    this.cdr.detectChanges();
  }

  toggleGeneral(){
    this.selectStep('general-info','general-circle');
    this.showGeneral=true;
    this.showChars=false;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  toggleChars(){
    this.selectStep('chars','chars-circle');
    this.showGeneral=false;
    this.showChars=true;
    this.showSummary=false;
    this.showPreview=false;
    this.refreshChars();
  }

  onTypeChange(event: any) {
    if(event.target.value=='string'){
      this.stringCharSelected=true;
      this.numberCharSelected=false;
      this.rangeCharSelected=false;
    }else if (event.target.value=='number'){
      this.stringCharSelected=false;
      this.numberCharSelected=true;
      this.rangeCharSelected=false;
    }else{
      this.stringCharSelected=false;
      this.numberCharSelected=false;
      this.rangeCharSelected=true;
    }
    this.creatingChars=[];
  }

  addCharValue(){
    if(this.stringCharSelected){
      console.log('string')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          value:this.stringValue as any
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          value:this.stringValue as any
        })
      }
      this.stringValue='';  
    } else if (this.numberCharSelected){
      console.log('number')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          value:this.numberValue as any,
          unitOfMeasure:this.numberUnit
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          value:this.numberValue as any,
          unitOfMeasure:this.numberUnit
        })
      }
      this.numberUnit='';
      this.numberValue='';
    }else{
      console.log('range')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          valueFrom:this.fromValue as any,
          valueTo:this.toValue as any,
          unitOfMeasure:this.rangeUnit
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          valueFrom:this.fromValue as any,
          valueTo:this.toValue as any,
          unitOfMeasure:this.rangeUnit})
      } 
    }
    this.fromValue='';
    this.toValue='';
    this.rangeUnit='';
  }

  selectDefaultChar(char:any,idx:any){
    for(let i=0;i<this.creatingChars.length;i++){
      if(i==idx){
        this.creatingChars[i].isDefault=true;
      } else {
        this.creatingChars[i].isDefault=false;
      }
    }
  }

  saveChar(){
    if(this.charsForm.value.name!=null){
      this.prodChars.push({
        id: 'urn:ngsi-ld:characteristic:'+uuidv4(),
        name: this.charsForm.value.name,
        description: this.charsForm.value.description != null ? this.charsForm.value.description : '',
        resourceSpecCharacteristicValue: this.creatingChars
      })
    }    

    this.charsForm.reset();
    this.creatingChars=[];
    this.showCreateChar=false;
    this.stringCharSelected=true;
    this.numberCharSelected=false;
    this.rangeCharSelected=false;
    this.refreshChars();
    this.cdr.detectChanges();
  }

  removeCharValue(char:any,idx:any){
    console.log(this.creatingChars)
    this.creatingChars.splice(idx, 1);
    console.log(this.creatingChars)
  }

  deleteChar(char:any){
    const index = this.prodChars.findIndex(item => item.id === char.id);
    if (index !== -1) {
      console.log('eliminar')
      this.prodChars.splice(index, 1);
    }   
    this.cdr.detectChanges();
    console.log(this.prodChars)    
  }

  showFinish(){
    if(this.generalForm.value.name!=null){
      this.resourceToUpdate={
        name: this.generalForm.value.name,
        description: this.generalForm.value.description != null ? this.generalForm.value.description : '',
        lifecycleStatus: this.resStatus,
        resourceSpecCharacteristic: this.prodChars
      }
      this.showChars=false;
      this.showGeneral=false;
      this.showSummary=true;
      this.selectStep('summary','summary-circle');
      this.refreshChars();
    }
    this.showPreview=false;
  }

  updateResource(){
    this.resSpecService.updateResSpec(this.resourceToUpdate,this.res.id).subscribe({
      next: data => {
        this.goBack();
        console.log('serv updated')
      },
      error: error => {
        console.error('There was an error while updating!', error);
        if(error.error.error){
          console.log(error)
          this.errorMessage='Error: '+error.error.error;
        } else {
          this.errorMessage='There was an error while updating the resource!';
        }
        this.showError=true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    })
  }

  refreshChars(){
    this.stringValue= '';
    this.numberValue = '';
    this.numberUnit = '';
    this.fromValue = '';
    this.toValue = '';
    this.rangeUnit = '';
    this.stringCharSelected=true;
    this.numberCharSelected=false;
    this.rangeCharSelected=false;
    this.creatingChars=[];
  }

  //STEPS METHODS
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

  //STEPS CSS EFFECTS:
  selectStep(step:string,stepCircle:string){
    const index = this.stepsElements.findIndex(item => item === step);
    if (index !== -1) {
      this.stepsElements.splice(index, 1);
      this.selectMenu(document.getElementById(step),'text-primary-100 dark:text-primary-50')
      this.unselectMenu(document.getElementById(step),'text-gray-500') 
      for(let i=0; i<this.stepsElements.length;i++){
        this.unselectMenu(document.getElementById(this.stepsElements[i]),'text-primary-100 dark:text-primary-50')
        this.selectMenu(document.getElementById(this.stepsElements[i]),'text-gray-500') 
      }
      this.stepsElements.push(step);
    }
    const circleIndex = this.stepsCircles.findIndex(item => item === stepCircle);
    if (index !== -1) {
      this.stepsCircles.splice(circleIndex, 1);
      this.selectMenu(document.getElementById(stepCircle),'border-primary-100 dark:border-primary-50')
      this.unselectMenu(document.getElementById(stepCircle),'border-gray-400');
      for(let i=0; i<this.stepsCircles.length;i++){
        this.unselectMenu(document.getElementById(this.stepsCircles[i]),'border-primary-100 dark:border-primary-50')
        this.selectMenu(document.getElementById(this.stepsCircles[i]),'border-gray-400');
      }
      this.stepsCircles.push(stepCircle);
    }
  }

  //Markdown actions:
  addBold() {
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + ' **bold text** '
    });
  }

  addItalic() {
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + ' _italicized text_ '
    });
  }

  addList(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n- First item\n- Second item'
    });    
  }

  addOrderedList(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n1. First item\n2. Second item'
    });    
  }

  addCode(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n`code`'
    });    
  }

  addCodeBlock(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n```\ncode\n```'
    }); 
  }

  addBlockquote(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n> blockquote'
    });    
  }

  addLink(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + ' [title](https://www.example.com) '
    });    
  } 

  addTable(){
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + '\n| Syntax | Description |\n| ----------- | ----------- |\n| Header | Title |\n| Paragraph | Text |'
    });
  }

  addEmoji(event:any){
    console.log(event)
    this.showEmoji=false;
    const currentText = this.generalForm.value.description;
    this.generalForm.patchValue({
      description: currentText + event.emoji.native
    });
  }

  togglePreview(){
    if(this.generalForm.value.description){
      this.description=this.generalForm.value.description;
    } else {
      this.description=''
    }   
  }

}
