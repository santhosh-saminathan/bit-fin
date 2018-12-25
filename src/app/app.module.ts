import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { InternationalPhoneModule } from 'ng4-intl-phone';
// import { ToastrModule } from 'ngx-toastr';
// import { NgxStripeModule } from 'ngx-stripe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { MenuComponent } from './menu/menu.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WalletComponent } from './wallet/wallet.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ProfileComponent } from './profile/profile.component';
import { FooterComponent } from './footer/footer.component';
import { SigningService } from './services/signing.service';
import { ProfileService } from './services/profile.service';
import { CryptoService } from './services/crypto.service';
import { WalletService } from './services/wallet.service';
import { TransactionService } from './services/transaction.service';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MenuComponent,
    DashboardComponent,
    WalletComponent,
    TransactionsComponent,
    ProfileComponent,
    FooterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    QRCodeModule,
    ChartsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    InternationalPhoneModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
    // NgxStripeModule.forRoot('pk_test_uzFnOtl3tNwStqKIi5Vflq61')
  ],
  providers: [SigningService, ProfileService, CryptoService, WalletService, TransactionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
