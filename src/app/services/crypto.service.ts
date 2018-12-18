import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

let url = environment.apiUrl;

@Injectable()
export class CryptoService {

    constructor(private http: HttpClient) { }

    getUsdToXlm() {
        return this.http.get("https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=XLM");
    }

    getXlmToUsd() {
        return this.http.get("https://min-api.cryptocompare.com/data/price?fsym=XLM&tsyms=USD");
    }

    getRateFlow() {
        return this.http.get("https://min-api.cryptocompare.com/data/histohour?fsym=XLM&tsym=USD&limit=20");
    }

}
