import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';
import { FormatTime } from '../utilities';



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

  ngOnInit() {
    this.rpcService.getLogs(data =>{
      this.logs = data
      for(let log of this.logs)
      {
        log.timestamp = FormatTime(new Date(log.timestamp));
      }
    } )
  }

}
