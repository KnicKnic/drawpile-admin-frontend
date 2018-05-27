import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';




@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  logs = []
  keys = []
  constructor(private rpcService: RpcService) {
    this.keys = this.rpcService.getLogKeys();
  }

  formatTime(zuluTime: string){
    let zuluDateTime = new Date(zuluTime);
    if(!zuluTime.includes('GMT') && !zuluTime.includes('Z') )
    {
      let zuluDateTime = new Date(zuluTime+ " GMT");
    }
    return zuluDateTime.toLocaleDateString() + " " + zuluDateTime.toLocaleTimeString();
  }

  ngOnInit() {
    this.rpcService.getLogs(data =>{
      this.logs = data
      for(let log of this.logs)
      {
        log.timestamp = this.formatTime(log.timestamp);
      }
    } )
  }

}
