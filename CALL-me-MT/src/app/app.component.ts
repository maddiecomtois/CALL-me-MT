import { Component, OnInit } from '@angular/core';
import { TranslateService } from './translate.service';
import * as deepl from 'deepl-node';
import { HttpClient } from '@angular/common/http';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CALL-me-MT';
  textArea:any;
  textToTranslate:string = '';
  translatedText:string = '';
  deeplPercentageLeft:number = 0;
  targetLang:string = '';

  
  constructor(private ts:TranslateService, private http: HttpClient){}
  
  
  ngOnInit(): void {
    this.getUsageStats();
    this.textArea = <HTMLInputElement>document.getElementById("textContent");
    this.getText('english1.txt', 'FR');
    
    // create dropdown menu for story selection
    let dropdown = document.getElementsByClassName("dropdown-btn") as HTMLCollectionOf<HTMLElement>;
    /*
    for (let i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", () => {
        dropdown[i].ontoggle("active");
        let dropdownContent = dropdown[i].nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }
    */
    
    
    
  }
  
  getUsageStats() {
    this.ts.getUsageStats().subscribe( res => {
      let character_used = res.data.character_count
      let character_limit = res.data.character_limit
      this.deeplPercentageLeft = 100 - ((res.data.character_count / res.data.character_limit) * 100)
    });
    
  }
  
  async getText(text:string, langCode:string) {
    await this.http.get(`../assets/${text}`, {responseType: 'text' as 'json'}).subscribe((data: any) => {
      this.textArea.value = data;
    });
    this.targetLang = langCode;
    
  }
  
  getSelectedText(){
    let text:string = this.textArea.value;
    let indexStart = this.textArea.selectionStart!;
    let indexEnd = this.textArea.selectionEnd!;
    this.textToTranslate = text.substring(indexStart, indexEnd);
    this.textToTranslate = this.textToTranslate.replace(/[“”«»]+/g, '');
    this.translateText()
  }
  
  translateText() {
    this.translatedText = "";
    this.ts.translate(this.textToTranslate, this.targetLang).subscribe( res => {
      console.log(res.translations);
      this.translatedText = res.translations[0].text;
    },
    err => {
          console.log(err.message)
        },
    );
    this.getUsageStats();
  }
  

  getTheWord(selectionStart:any, value:any){
    let arr = value.split(" ");
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i].length + 1
      if (sum > selectionStart) return arr[i]

    }
  }

}
