import { Component, OnInit } from '@angular/core';
import { TranslateService } from './translate.service';
import * as deepl from 'deepl-node';
import { HttpClient } from '@angular/common/http';

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

  
  constructor(private ts:TranslateService, private http: HttpClient){}
  
  
  ngOnInit(): void {
    
    this.textArea = <HTMLInputElement>document.getElementById("textContent");
    
    this.ts.getUsageStats().subscribe( res => {
      console.log(res);
    });
    
    this.getText('english1.txt');
    
  }
  
  async getText(text:string) {
    await this.http.get(`../assets/${text}`, {responseType: 'text' as 'json'}).subscribe((data: any) => {
      this.textArea.value = data;
    });
  }
  
  getSelectedText(){
    let text = this.textArea.value;
    let indexStart = this.textArea.selectionStart!;
    let indexEnd = this.textArea.selectionEnd!;
    this.textToTranslate = text.substring(indexStart, indexEnd);
    this.translateText()
  }
  
  translateText() {
    this.ts.translate(this.textToTranslate).subscribe( res => {
      console.log(res.translations);
      this.translatedText = res.translations[0].text;
    });
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
