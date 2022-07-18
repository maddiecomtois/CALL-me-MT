import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  
  baseURL = "http://localhost:8000/";

  constructor(private http: HttpClient) { }
  
  getUsageStats():Observable<any> {
    return this.http.get('http://localhost:8000/getDeepLUsageStats')
  }
  
  translateDeepl(text:string, targetLang:string):Observable<any> {
    console.log("Text to translate: ", text);
    console.log("Target language: ", targetLang)
    return this.http.post('translateDeepl', {textToTranslate:text, targetLanguage:targetLang})
  }
  
  translateMicrosoft(text:string, targetLang:string):Observable<any> {
    console.log("Text to translate: ", text);
    console.log("Target language: ", targetLang)
    return this.http.post('translateMicrosoft', {textToTranslate:text, targetLanguage:targetLang})
  }
  
  translateGoogle(text:string, targetLang:string):Observable<any> {
    console.log("Text to translate: ", text);
    console.log("Target language: ", targetLang)
    return this.http.post('translateGoogle', {textToTranslate:text, targetLanguage:targetLang})
  }
  
}
