import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MarkdownTextareaComponent} from "src/app/shared/forms/markdown-textarea/markdown-textarea.component";
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [MarkdownTextareaComponent, ReactiveFormsModule],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css'
})
export class EntryFormComponent {
  constructor(
    private router: Router
  ) {
  }

  entryForm = new FormGroup({
    title: new FormControl('', [Validators.required,]),
    content: new FormControl(''),
  });
  loading:boolean=false;

  goBack(){
    this.router.navigate(['/blog']);
  }


}
