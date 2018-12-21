import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

let url = environment.apiUrl;

@Injectable()
export class WalletService {

    constructor(private http: HttpClient) { }

    autocompleteMobileNumber(data) {
        let userId = localStorage.getItem('userId')
        return this.http.get(url + "search?mobile_number=" + data);
    }

    userSavedCardDetails() {
        let userId = localStorage.getItem('userId')
        return this.http.get(url + "card/" + userId);
    }

    savedWithdrawBankDetails() {
        let userId = localStorage.getItem('userId');
        return this.http.get(url + "withdraw/" + userId);
    }

    makePayment(data) {
        let userId = localStorage.getItem('userId');
        return this.http.post(url + "payment", data);
    }

    getAdminDetails() {
        return this.http.get(url + "admin");
    }

    withdrawFromAccount(data) {
        let userId = localStorage.getItem('userId')
        return this.http.post(url + "withdraw/" + userId, data);
    }

    depositAmount(data){
        return this.http.post(url + "deposit" , data);
    }

}
