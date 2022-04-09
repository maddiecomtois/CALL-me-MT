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

  
  constructor(private ts:TranslateService, private http: HttpClient){}
  
  
  ngOnInit(): void {
    
    this.ts.getUsageStats().subscribe( res => {
      console.log(res);
    });
      
    //let spanishData = this.http.get('../assets/spanishTest.txt').toPromise()!;
    //console.log(spanishData);
    //textarea.value = spanishData;
    
    /*
    const myArea = <HTMLInputElement>document.getElementById("textContent")
    if(myArea) {
      myArea.value = "Hello world!"
      myArea.onclick = (e) => {
        if(e.currentTarget) {
          let i = e.currentTarget.selectionStart
          console.log(this.getTheWord(i, myArea.value))
          
        }
      
      }
      
    }
    */

    
  }
  
  async getText(text:string) {
    let textarea = <HTMLInputElement>document.getElementById("textContent");
    await this.http.get(`../assets/${text}`, {responseType: 'text' as 'json'}).subscribe((data: any) => {
      textarea.value = data;
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
