import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  constructor(private http: HttpClient) { }
  
  getUsageStats():Observable<any> {
    return this.http.get('http://localhost:8000/getDeepLUsageStats')
  }
  
  translate(text:string):Observable<any> {
    console.log("Text to translate: ", text);
    return this.http.post('http://localhost:8000/translate', {textToTranslate:text})
  }
  
}
