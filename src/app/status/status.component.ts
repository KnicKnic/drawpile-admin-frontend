import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RpcService } from '../rpc.service';


@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  status = null;
  keys = []
  constructor(private rpcService: RpcService) {
    this.keys = this.rpcService.getStatusKeys();
  }

  makeNumber(s: string[])
  {
    let n: number[] = [];
    for(var x of s){
      n.push(Number(x));
    }
    return n;
  }
  parseTime(zuluTime: string){
    // safari won't parse this
    //let zuluDateTime = new Date(zuluTime);
    // if(!zuluTime.includes('GMT') && !zuluTime.includes('Z') )
    // {
    //   zuluDateTime = new Date(zuluTime+ " GMT");
    // }
    // so lets do safari workaround
    var time = zuluTime.split(' ');
    var dates = this.makeNumber(time[0].split('-'));
    var times = this.makeNumber(time[1].split(':'));
    let zuluDateTime = new Date(dates[0], dates[1]-1, dates[2], times[0], times[1], times[2] )

    zuluDateTime.setMinutes(zuluDateTime.getMinutes() - zuluDateTime.getTimezoneOffset())
    return zuluDateTime.toLocaleDateString() + " " + zuluDateTime.toLocaleTimeString();
  }
  ngOnInit() {
    this.rpcService.getStatus(data =>{
      this.status = data;
      this.status.started = this.parseTime(this.status.started);
  });
  }

  formatTime(zuluTime: string){
    let zuluDateTime = new Date(zuluTime);
    if(!zuluTime.includes('GMT') && !zuluTime.includes('Z') )
    {
      let zuluDateTime = new Date(zuluTime+ " GMT");
    }
    return zuluDateTime.toLocaleDateString() + " " + zuluDateTime.toLocaleTimeString();
  }

}
