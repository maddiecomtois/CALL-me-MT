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
    
  }
  
  
}
