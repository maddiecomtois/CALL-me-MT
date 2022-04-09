import { Component, OnInit } from '@angular/core';
import { TranslateService } from './translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CALL-me-MT';
  
  constructor(private ts:TranslateService){}
  
  ngOnInit(): void {
    
    this.ts.getUsageStats().subscribe( res => {
      console.log(res);
    });
    
    let textarea = <HTMLInputElement>document.getElementById("readingMaterial");
    textarea.value = "hello"
    
    let spanishData = await this.http.get('../assets/spanishText.txt').toPromise()!;
    
    /*
    const myArea = <HTMLInputElement>document.getElementById("readingMaterial")
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
  
  getTheWord(selectionStart:any, value:any){
    let arr = value.split(" ");
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i].length + 1
      if (sum > selectionStart) return arr[i]

    }
  }


  
  
}
