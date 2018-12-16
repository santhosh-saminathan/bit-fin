import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

let url = environment.apiUrl;

@Injectable()
export class TransactionService {

    constructor(private http: HttpClient) { }

    sentTransactions() {
        let userId = localStorage.getItem('userId')
        return this.http.get(url + "sentTransaction/" + userId);
    }

    receivedTransactions() {
        let userId = localStorage.getItem('userId')
        return this.http.get(url + "receivedTransaction/" + userId);
    }

    depositTransactions() {
        let userId = localStorage.getItem('userId');
        return this.http.get(url + "depositTransaction/" + userId);
    }

    withdrawTransactions() {
        let userId = localStorage.getItem('userId');
        return this.http.get(url + "withdrawTransaction/" + userId);
    }

  



}
