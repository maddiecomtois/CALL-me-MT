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
  popoverVisibility:string = "none"
  loadingText:boolean = false;
  
  appitems = [
    {
      label: 'Chinese', // https://cti.lib.virginia.edu/cll/chinese_literature/malau/TCStoc.htm
      items: [
        {
          label: 'Old Servant Hsu',
          onSelected: ()=> {this.getText('chinese1.txt', 'EN-GB')}
        },
        {
          label: 'The Jest That Leads to Disaster',
          onSelected: ()=> {this.getText('chinese2.txt', 'EN-GB')}
        },
        {
          label: 'The Oil Peddler Courts the Courtesan',
          onSelected: ()=> {this.getText('chinese3.txt', 'EN-GB')}
        }
      ]
    },
    {
      label: 'Czech',
      items: [
        {
          label: 'Štafeta',
          onSelected: ()=> {this.getText('czech1.txt', 'EN-GB')}
        },
        {
          label: 'Blesky nad Beskydami',
          onSelected: ()=> {this.getText('czech2.txt', 'EN-GB')}
        },
        {
          label: 'Zápisky z mrtvého domu',
          onSelected: ()=> {this.getText('czech3.txt', 'EN-GB')}
        }
      ]
    },
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
    },
    {
      label: 'Italian',
      items: [
        {
          label: 'Le Avventure di Pinocchio',
          onSelected: ()=> {this.getText('italian1.txt', 'EN-GB')}
        },
        {
          label: 'L’Amore che torna',
          onSelected: ()=> {this.getText('italian2.txt', 'EN-GB')}
        },
        {
          label: 'Forse Che Si Forse Che No',
          onSelected: ()=> {this.getText('italian3.txt', 'EN-GB')}
        }
      ]
    },
    {
      label: 'Japanese',
      items: [
        {
          label: 'Kesshouki',
          onSelected: ()=> {this.getText('japanese1.txt', 'EN-GB')}
        },
        {
          label: 'Amerika Monogatari',
          onSelected: ()=> {this.getText('japanese2.txt', 'EN-GB')}
        },
        {
          label: 'Horadanshaku tabimiyage',
          onSelected: ()=> {this.getText('japanese3.txt', 'EN-GB')}
        }
      ]
    },
    {
      label: 'Portuguese',
      items: [
        {
          label: 'Historia Alegre de Portugal',
          onSelected: ()=> {this.getText('portuguese1.txt', 'EN-GB')}
        },
        {
          label: 'A Chave Do Enigma',
          onSelected: ()=> {this.getText('portuguese2.txt', 'EN-GB')}
        },
        {
          label: 'Aquela família',
          onSelected: ()=> {this.getText('portuguese3.txt', 'EN-GB')}
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
    console.log("Loading text")
    this.loadingText = true;
    await this.http.get(`../assets/${text}`, {responseType: 'text' as 'json'}).subscribe((data: any) => {
      //this.textParagraphs = data.split(/(?:\r?\n)+/);
      this.textParagraphs = data.split('\n');
      //this.textContent.innerHTML = data;
      this.loadingText = false;
      console.log("Done loading text")
    });
    this.targetLang = langCode;

  }
  
  getSelectedText(){    
    if (window.getSelection) {
        // get selected text
        this.textToTranslate = window.getSelection().toString();
        this.textToTranslate = this.textToTranslate.replace(/[“”«»]+/g, '');
        console.log(this.textToTranslate);

        // display translated text or hide if no text selected
        if (this.textToTranslate != "") {
          this.translateText();
          this.displayTranslation(window.getSelection().getRangeAt(0));
          this.popoverVisibility = "block";
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
  
  displayTranslation(range) {
    
    //document.selection.createRange().htmlText     // For getting entire text, not just selection?
    
    Popper.createPopper(range, document.querySelector('.popoverContainer'), {
        placement: 'right',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
        ],
        strategy: 'fixed',
    });
    
  }

}
