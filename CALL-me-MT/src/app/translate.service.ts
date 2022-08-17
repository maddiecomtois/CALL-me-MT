import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  
  // local serving
  //baseURL = "http://localhost:8000/";
  
  // live serving
  baseURL = "";

  constructor(private http: HttpClient) { }
  
  getUsageStats():Observable<any> {
    return this.http.get(this.baseURL + 'getDeepLUsageStats')
  }
  
  translateDeepl(text:string, targetLang:string):Observable<any> {
    console.log("Text to translate: ", text);
    console.log("Target language: ", targetLang)
    return this.http.post(this.baseURL + 'translateDeepl', {textToTranslate:text, targetLanguage:targetLang})
  }
  
  translateMicrosoft(text:string, targetLang:string):Observable<any> {
    console.log("Text to translate: ", text);
    console.log("Target language: ", targetLang)
    return this.http.post(this.baseURL + 'translateMicrosoft', {textToTranslate:text, targetLanguage:targetLang})
  }
  
  translateGoogle(text:string, targetLang:string):Observable<any> {
    console.log("Text to translate: ", text);
    console.log("Target language: ", targetLang)
    return this.http.post(this.baseURL + 'translateGoogle', {textToTranslate:text, targetLanguage:targetLang})
  }
  
}
