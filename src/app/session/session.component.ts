import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { RpcService } from '../rpc.service';
import { FormatTime } from '../utilities';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {
  id = null;
  session = null;
  sessionNoModify = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rpcService: RpcService,
  ) {    
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.refreshData();
  }

  refreshData(){
    this.rpcService.getSession(data =>{
      this.session = data;
      this.session['password'] = ''
      this.session.startTime = FormatTime(new Date(this.session.startTime));
      this.sessionNoModify = Object.assign({}, this.session);      
    }, this.id);
  }

  hasModifications(){
    for(var propertyName in this.session)
    {
      if(this.session[propertyName] != this.sessionNoModify[propertyName])
      {
        return true;
      }
    }
    return false;
  }

  update(){
    let update = Object.assign({}, this.session);      
    for(var propertyName in this.session)
    {
      if(this.session[propertyName] == this.sessionNoModify[propertyName])
      {
        delete update[propertyName]
      }
    }
    if(this.session['hasPassword'] != this.sessionNoModify['hasPassword'])
    {
      delete update['hasPassword']
      if(this.session['hasPassword'])
      {
        if(!update['password'])
        {
          alert('you must type a password if setting a password');
          return;
        }
      }
      else{
        update['password'] = ''
      }
    }
    this.rpcService.updateSession((success)=>success?this.refreshData():'', update, this.session.id);    
  }

  messageAll(){
    var message = prompt("Message to send to everyone", "");
    if (message != null) {
        this.rpcService.messageSession(message, this.id);
    }
  }
  delete(){
    if(confirm('Do you want to terminate this session'))
    {
      this.rpcService.deleteSession( this.id );
    }
  }
}
