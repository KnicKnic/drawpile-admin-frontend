import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';
import { FormatTime } from '../utilities';


@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  sessions = [];
  keys = [  ]

  constructor(private rpcService: RpcService){
    this.keys = this.rpcService.getSessionKeys();
  }


  refreshData(){
    this.rpcService.getSessions(data => {
      this.sessions = data;
      
      for(let session of this.sessions)
      {
        session.startTime = FormatTime(new Date(session.startTime));
      }
    });
  }
  ngOnInit() {
    this.refreshData();
  }

  messageAll(){
    var message = prompt("Message to send to everyone", "");
    if (message != null) {
        this.rpcService.messageSessions(message);
    }
  }
}
