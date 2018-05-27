import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';


@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  sessions = [];
  selectedRow : number;
  setClickedRow : Function;
  keys = [  ]

  constructor(private rpcService: RpcService){
    this.keys = this.rpcService.getSessionKeys();
    this.selectedRow = null;
    this.setClickedRow = function (index) {
      if (this.selectedRow == index) {
        this.selectedRow = null;
      }
      else {
        this.selectedRow = index;
      }
    }
  }

  refreshData(){
    this.rpcService.getSessions(data => this.sessions = data);
    this.selectedRow = null;
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
