import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
 
let url = environment.apiUrl;
 
@Injectable()
export class SigningService {
 
    constructor(private http: HttpClient) { }
 
    login(data) {
        return this.http.post(url + "user", data);
    }
 
    signup(data) {
        return this.http.post(url + "user", data);
    }

    getCountryCodes(){
        return this.http.get(url + "code");
    }
 
}
