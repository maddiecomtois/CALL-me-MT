import { Component, OnInit } from '@angular/core';
import { TranslateService } from './translate.service';
import * as deepl from 'deepl-node';
import { HttpClient } from '@angular/common/http';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators'

import * as Popper from '@popperjs/core'
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow.js';
import flip from '@popperjs/core/lib/modifiers/flip.js';
import {MatDialog} from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component'

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
  
  appitems = [
    {
      label: 'English',
      items: [
        {
          label: 'Pride and Prejudice',
          onSelected: ()=> {this.getText('english1.txt', 'FR')}
        },
        {
          label: 'Alice’s Adventures in Wonderland',
          onSelected: ()=> {this.getText('english2.txt', 'FR')}
        },
        {
          label: 'The Great Gatsby',
          onSelected: ()=> {this.getText('english3.txt', 'FR')}
        }
      ]
    },
    {
      label: 'French',
      items: [
        {
          label: 'Douze ans de séjour',
          onSelected: ()=> {this.getText('french1.txt', 'EN-GB')}
        },
        {
          label: 'Contes merveilleux',
          onSelected: ()=> {this.getText('french2.txt', 'EN-GB')}
        },
        {
          label: 'La femme française dans les temps modernes',
          onSelected: ()=> {this.getText('french3.txt', 'EN-GB')}
        }
      ]
    },
    {
      label: 'Spanish',
      items: [
        {
          label: 'El amor, el dandysmo y la intriga',
          onSelected: ()=> {this.getText('spanish1.txt', 'EN-GB')}
        },
        {
          label: 'Velázquez en el museo del Prado',
          onSelected: ()=> {this.getText('spanish2.txt', 'EN-GB')}
        },
        {
          label: 'El tesoro misterioso',
          onSelected: ()=> {this.getText('spanish3.txt', 'EN-GB')}
        }
      ]
    },
    {
      label: 'German',
      items: [
        {
          label: 'Der Tod in Venedig',
          onSelected: ()=> {this.getText('german1.txt', 'EN-GB')}
        },
        {
          label: 'Die Verwandlung',
          onSelected: ()=> {this.getText('german2.txt', 'EN-GB')}
        },
        {
          label: 'Effi Briest',
          onSelected: ()=> {this.getText('german3.txt', 'EN-GB')}
        }
      ]
    }
  ];

  config = {
        paddingAtStart: true,
        listBackgroundColor: '#c1daee',
        fontColor: 'rgb(8, 54, 71)',
        backgroundColor: '#c1daee',
        selectedListFontColor: 'black',
      };

  
  constructor(private ts:TranslateService, private http: HttpClient, public dialog: MatDialog){}
  
  
  ngOnInit(): void {
    this.openDialog();
    this.getUsageStats();
    this.textContent = <HTMLInputElement>document.getElementById("textContent");
    this.getText('english1.txt', 'FR');
      
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(!result) {
        window.top.location.reload(true);
        window.top.close();
      }
    });
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
    this.ts.translateMicrosoft(this.textToTranslate, this.targetLang).subscribe( res => {
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
  
  test(item) {
    console.log(item)
  }

}
