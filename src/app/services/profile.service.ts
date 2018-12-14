import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

let url = environment.apiUrl;

@Injectable()
export class ProfileService {

    constructor(private http: HttpClient) { }

    updateProfile(data) {
        let userId = localStorage.getItem('userId')
        return this.http.post(url + "user/" + userId, data);
    }

    updateKYC(data) {
        let userId = localStorage.getItem('userId')
        return this.http.post(url + "proof/" + userId, data);
    }

}
