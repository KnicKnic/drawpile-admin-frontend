import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { AccountsComponent } from './accounts/accounts.component';
import { LogsComponent } from './logs/logs.component';
import { BansComponent } from './bans/bans.component';
import { UsersComponent } from './users/users.component';
import { SessionsComponent } from './sessions/sessions.component';
import { ServerComponent } from './server/server.component';
import { StatusComponent } from './status/status.component';
import { RestInputComponent } from './rest-input/rest-input.component';
import { AppRoutingModule } from './/app-routing.module';
import { RpcService } from './rpc.service';
import { AccountAddComponent } from './account-add/account-add.component';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BanAddComponent } from './ban-add/ban-add.component';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    LogsComponent,
    BansComponent,
    UsersComponent,
    SessionsComponent,
    ServerComponent,
    StatusComponent,
    RestInputComponent,
    AccountAddComponent,
    BanAddComponent,
    SessionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatDialogModule,
     BrowserAnimationsModule
  ],
  providers: [RpcService],
  bootstrap: [AppComponent],
  entryComponents: [
    AccountAddComponent,
    BanAddComponent,
  ],
})
export class AppModule { }
