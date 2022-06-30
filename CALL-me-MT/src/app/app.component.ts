import { Component, OnInit } from '@angular/core';
import { TranslateService } from './translate.service';
import * as deepl from 'deepl-node';
import { HttpClient } from '@angular/common/http';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators'

import * as Popper from '@popperjs/core'
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CALL-me-MT';
  textContent:any;
  textParagraphs:string[];
  textToTranslate:string = '';
  translatedText:string = '';
  deeplPercentageLeft:number = 0;
  targetLang:string = '';
  
  translationPopover:any;
  popoverVisibility:string = "none"

  
  constructor(private ts:TranslateService, private http: HttpClient){}
  
  
  ngOnInit(): void {
    this.getUsageStats();
    this.textContent = <HTMLInputElement>document.getElementById("textContent");
    this.getText('english1.txt', 'FR');
      
  }
  
  getUsageStats() {
    this.ts.getUsageStats().subscribe( res => {
      console.log(res)
      let character_used = res.data.character_count
      let character_limit = res.data.character_limit
      this.deeplPercentageLeft = 100 - ((res.data.character_count / res.data.character_limit) * 100)
    });
    
  }
  
  async getText(text:string, langCode:string) {
    await this.http.get(`../assets/${text}`, {responseType: 'text' as 'json'}).subscribe((data: any) => {
      //this.textParagraphs = data.split(/(?:\r?\n)+/);
      this.textParagraphs = data.split('\n');
      //this.textContent.innerHTML = data;
    });
    this.targetLang = langCode;
    
  }
  
  getSelectedText(){
    //let text:string = this.textContent.innerHTML;
    //let indexStart = this.textContent.selectionStart!;
    //let indexEnd = this.textContent.selectionEnd!;
    //this.textToTranslate = text.substring(indexStart, indexEnd);
    //this.textToTranslate = this.textToTranslate.replace(/[“”«»]+/g, '');
    
    if (window.getSelection) {
        // get selected text
        this.textToTranslate = window.getSelection().toString();
        this.textToTranslate = this.textToTranslate.replace(/[“”«»]+/g, '');
        console.log(this.textToTranslate);

        // display translated text or hide if no text selected
        if (this.textToTranslate != "") {
          this.translateText()
          this.popoverVisibility = "block";
          this.displayTranslation()
        }
        else {
          this.popoverVisibility = "none";
        }
      }
  }
  
  translateText() {
    this.translatedText = "";
    this.ts.translateGoogle(this.textToTranslate, this.targetLang).subscribe( res => {
      console.log(res)
      this.translatedText = res;
    },
    err => {
          console.log(err.message)
        },
    );
    this.getUsageStats();
  }
  
  displayTranslation() {
    let selection = window.getSelection().getRangeAt(0);
    this.translationPopover = document.querySelector('.popoverContainer'); 
    
    Popper.createPopper(selection, this.translationPopover, {
        placement: 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          preventOverflow,
          flip
        ]
    });
    
  }
  
/*
  getTheWord(selectionStart:any, value:any){
    let arr = value.split(" ");
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i].length + 1
      if (sum > selectionStart) return arr[i]

    }
  }
  */

}
