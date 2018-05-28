import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';


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

  formatTime(zuluTime: string){
    let zuluDateTime = new Date(zuluTime);
    if(!zuluTime.includes('GMT') && !zuluTime.includes('Z') )
    {
      let zuluDateTime = new Date(zuluTime+ " GMT");
    }
    return zuluDateTime.toLocaleDateString() + " " + zuluDateTime.toLocaleTimeString();
  }

  refreshData(){
    this.rpcService.getSessions(data => {
      this.sessions = data;
      
      for(let session of this.sessions)
      {
        session.startTime = this.formatTime(session.startTime);
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
