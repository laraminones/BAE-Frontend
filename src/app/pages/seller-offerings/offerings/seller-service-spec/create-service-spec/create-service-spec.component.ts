import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {LocalStorageService} from "src/app/services/local-storage.service";
import {EventMessageService} from "src/app/services/event-message.service";
import { ServiceSpecServiceService } from 'src/app/services/service-spec-service.service';
import {AttachmentServiceService} from "src/app/services/attachment-service.service";
import { LoginInfo } from 'src/app/models/interfaces';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import {components} from "src/app/models/service-catalog";
import { initFlowbite } from 'flowbite';
type ServiceSpecification_Create = components["schemas"]["ServiceSpecification_Create"];
type CharacteristicValueSpecification = components["schemas"]["CharacteristicValueSpecification"];
type ProductSpecificationCharacteristic = components["schemas"]["CharacteristicSpecification"];
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'create-service-spec',
  templateUrl: './create-service-spec.component.html',
  styleUrl: './create-service-spec.component.css'
})
export class CreateServiceSpecComponent implements OnInit {

  partyId:any='';

  serviceToCreate:ServiceSpecification_Create | undefined;

  stepsElements:string[]=['general-info','chars','plugins','summary'];
  stepsCircles:string[]=['general-circle','chars-circle','plugins-circle','summary-circle'];

  //markdown variables:
  showPreview:boolean=false;
  showEmoji:boolean=false;
  description:string='';  

  //CONTROL VARIABLES:
  showGeneral:boolean=true;
  showChars:boolean=false;
  showSummary:boolean=false;
  showPlugins:boolean=false;
  //Check if step was done
  generalDone:boolean=false;
  charsDone:boolean=false;
  finishDone:boolean=false;  
  pluginsDone:boolean=false;

  //SERVICE GENERAL INFO:
  generalForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  //CHARS INFO
  charsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });
  stringCharSelected:boolean=true;
  numberCharSelected:boolean=false;
  rangeCharSelected:boolean=false;
  prodChars:ProductSpecificationCharacteristic[]=[];
  creatingChars:CharacteristicValueSpecification[]=[];
  showCreateChar:boolean=false;

  //ASSETS
  assets:any[]=[];
  assetsSelected:boolean=false;
  selectedAsset:any;
  attFileName = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z0-9 _.-]*')]);
  assetURL = new FormControl('', [Validators.required])
  public files: NgxFileDropEntry[] = [];
  filePreview:boolean=false;
  createdFile:any;
  dynamicForm!: FormGroup;
  formFields:any;
  objectFormFields:any;

  errorMessage:any='';
  showError:boolean=false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private localStorage: LocalStorageService,
    private eventMessage: EventMessageService,
    private elementRef: ElementRef,
    private attachmentService: AttachmentServiceService,
    private servSpecService: ServiceSpecServiceService,
    private fb: FormBuilder
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

  @ViewChild('stringValue') charStringValue!: ElementRef;
  @ViewChild('numberValue') charNumberValue!: ElementRef;
  @ViewChild('numberUnit') charNumberUnit!: ElementRef;
  @ViewChild('fromValue') charFromValue!: ElementRef;
  @ViewChild('toValue') charToValue!: ElementRef;
  @ViewChild('rangeUnit') charRangeUnit!: ElementRef;

  ngOnInit() {
    this.initPartyInfo();
    this.dynamicForm = this.fb.group({});
    this.servSpecService.getAssetTypes().then(data => {
      console.log('-- assets --')
      console.log(data)
      this.assets=data;
      if(this.assets.length>0){
        this.selectedAsset=this.assets[0];
        this.formFields=this.selectedAsset.form;
        Object.keys(this.formFields).forEach(field => {
          const fieldData = this.formFields[field];
          const control = this.fb.control(
            fieldData.default || '', 
            fieldData.mandatory ? Validators.required : []
          );
          this.objectFormFields=Object.keys(this.formFields)
          console.log(Object.keys(this.formFields))
          this.dynamicForm.addControl(field, control);
        });
      }
    })
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

  goBack() {
    this.eventMessage.emitSellerServiceSpec(true);
  }

  toggleGeneral(){
    this.selectStep('general-info','general-circle');
    this.showGeneral=true;
    this.showChars=false;
    this.showSummary=false;
    this.showPreview=false;
    this.showPlugins=false;
  }

  toggleChars(){
    this.selectStep('chars','chars-circle');
    this.showGeneral=false;
    this.showChars=true;
    this.showSummary=false;
    this.showPreview=false;
    this.showPlugins=false;
  }

  togglePlugins(){
    this.selectStep('plugins','plugins-circle');
    this.showGeneral=false;
    this.showChars=false;
    this.showSummary=false;
    this.showPreview=false;
    this.showPlugins=true;
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

  onAssetChange(event: any){    
    if(this.formFields){
      Object.keys(this.formFields).forEach(field => {
        this.dynamicForm.removeControl(field)
      });
    }
    let idx = this.assets.findIndex((element: { id: any; }) => element.id == event.target.value) 
    this.selectedAsset=this.assets[idx];
    this.formFields=this.selectedAsset.form;
    if(this.formFields){
      Object.keys(this.formFields).forEach(field => {
        const fieldData = this.formFields[field];
        const control = this.fb.control(
          fieldData.default || '', 
          fieldData.mandatory ? Validators.required : []
        );
        this.dynamicForm.addControl(field, control);
      });
      this.objectFormFields=Object.keys(this.formFields);
    }
    console.log('asset change')
    console.log(this.selectedAsset)
  }

  addCharValue(){
    if(this.stringCharSelected){
      console.log('string')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          value:this.charStringValue.nativeElement.value
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          value:this.charStringValue.nativeElement.value
        })
      }      
    } else if (this.numberCharSelected){
      console.log('number')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          value:this.charNumberValue.nativeElement.value,
          unitOfMeasure:this.charNumberUnit.nativeElement.value
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          value:this.charNumberValue.nativeElement.value,
          unitOfMeasure:this.charNumberUnit.nativeElement.value
        })
      } 
    }else{
      console.log('range')
      if(this.creatingChars.length==0){
        this.creatingChars.push({
          isDefault:true,
          valueFrom:this.charFromValue.nativeElement.value,
          valueTo:this.charToValue.nativeElement.value,
          unitOfMeasure:this.charRangeUnit.nativeElement.value
        })
      } else{
        this.creatingChars.push({
          isDefault:false,
          valueFrom:this.charFromValue.nativeElement.value,
          valueTo:this.charToValue.nativeElement.value,
          unitOfMeasure:this.charRangeUnit.nativeElement.value})
      } 
    }
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
        characteristicValueSpecification: this.creatingChars
      })
    }

    this.charsForm.reset();
    this.creatingChars=[];
    this.showCreateChar=false;
    this.stringCharSelected=true;
    this.numberCharSelected=false;
    this.rangeCharSelected=false;
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
    console.log('---form vals ---')
    console.log(this.dynamicForm.value)
    this.charsDone=true;
    this.finishDone=true;
    this.showPlugins=false;
    if(this.generalForm.value.name!=null){
      this.serviceToCreate={
        name: this.generalForm.value.name,
        description: this.generalForm.value.description != null ? this.generalForm.value.description : '',
        lifecycleStatus: "Active",
        specCharacteristic: this.prodChars,
        relatedParty: [
          {
              id: this.partyId,
              //href: "http://proxy.docker:8004/party/individual/urn:ngsi-ld:individual:803ee97b-1671-4526-ba3f-74681b22ccf3",
              role: "Owner",
              "@referredType": ''
          }
        ],
      }
      console.log('SERVICE TO CREATE:')
      console.log(this.serviceToCreate)
      this.showChars=false;
      this.showGeneral=false;
      this.showSummary=true;
      this.selectStep('summary','summary-circle');
    }
    this.showPreview=false;
  }

  createService(){
    this.servSpecService.postServSpec(this.serviceToCreate).subscribe({
      next: data => {
        this.goBack();
        console.log('serv created')
      },
      error: error => {
        console.error('There was an error while creating!', error);
        if(error.error.error){
          console.log(error)
          this.errorMessage='Error: '+error.error.error;
        } else {
          this.errorMessage='There was an error while creating the service!';
        }
        this.showError=true;
        setTimeout(() => {
          this.showError = false;
        }, 3000);
      }
    });
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
    }    
  }

  public dropped(files: NgxFileDropEntry[],sel:any) {
    this.files = files;
    for (const droppedFile of files) {
 
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log('dropped')       

          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              const base64String: string = e.target.result.split(',')[1];
              console.log('BASE 64....')
              console.log(base64String); // You can use this base64 string as needed
              let fileBody = {
                content: {
                  name: this.selectedAsset.name.replace(/\s/g, "")+file.name,
                  data: base64String
                },
                contentType: file.type,
                isPublic: false
              }
              this.attachmentService.uploadFile(fileBody).subscribe({
                next: data => {
                    console.log(data)
                    this.cdr.detectChanges();
                    console.log('uploaded')
                    this.filePreview=true;
                    this.createdFile=data.content;
                    console.log(this.createdFile)
                },
                error: error => {
                    console.error('There was an error while uploading!', error);
                    if(error.error.error){
                      console.log(error)
                      this.errorMessage='Error: '+error.error.error;
                    } else {
                      this.errorMessage='There was an error while uploading the file!';
                    }
                    if (error.status === 413) {
                      this.errorMessage='File size too large! Must be under 3MB.';
                    }
                    this.showError=true;
                    setTimeout(() => {
                      this.showError = false;
                    }, 3000);
                }
              });
            };
            reader.readAsDataURL(file);
          }
 
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any){
    console.log(event);
  }
 
  public fileLeave(event: any){
    console.log('leave')
    console.log(event);
  }

  deleteFile(){
    this.createdFile='';
    this.filePreview=false;
  }

}
