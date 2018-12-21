import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

let url = environment.apiUrl;

@Injectable()
export class ProfileService {

    constructor(private http: HttpClient) { }

    getUserDetails() {
        let userId = localStorage.getItem('userId')
        return this.http.get(url + "user/" + userId);
    }

    updateProfile(data) {
        let userId = localStorage.getItem('userId')
        return this.http.post(url + "user/" + userId, data);
    }

    updateKYC(data) {
        let userId = localStorage.getItem('userId')
        return this.http.post(url + "proof/" + userId, data);
    }

    getBalance() {
        let userId = localStorage.getItem('userId')
        return this.http.get(url + "account/" + userId);
    }

    uploadImage(data){
        return this.http.post(url + "upload", data);
     }

}
