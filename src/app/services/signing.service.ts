import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

let url = environment.apiUrl;

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) { }

    login(data) {
        return this.http.post(url + "login", data);
    }

}