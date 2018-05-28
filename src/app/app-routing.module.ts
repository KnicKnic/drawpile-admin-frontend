import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent }    from './accounts/accounts.component';
import { BansComponent }        from './bans/bans.component';
import { LogsComponent }        from './logs/logs.component';
import { ServerComponent }      from './server/server.component';
import { SessionComponent }     from './session/session.component';
import { SessionsComponent }    from './sessions/sessions.component';
import { StatusComponent }      from './status/status.component';
import { UsersComponent }       from './users/users.component';


const routes: Routes = [
  { path: 'accounts', component: AccountsComponent },
  { path: 'bans', component: BansComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'server', component: ServerComponent },
  { path: 'sessions', component: SessionsComponent },
  { path: 'status', component: StatusComponent },
  { path: 'users', component: UsersComponent },
  { path: 'sessions/:id', component: SessionComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
