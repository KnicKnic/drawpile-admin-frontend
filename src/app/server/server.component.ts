import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';


@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  server = null;
  serverNoModify = null;
  keys = []
  constructor(private rpcService: RpcService) {
    this.keys = this.rpcService.getServerKeys();
  }

  get clientTimeout(): number {
    return this.server.clientTimeout/60;
  }

  set clientTimeout(newValue: number) {
    this.server.clientTimeout = newValue *60;
  }
  get idleTimeLimit(): number {
    return this.server.idleTimeLimit/60;
  }

  set idleTimeLimit(newValue: number) {
    this.server.idleTimeLimit = newValue *60;
  }
  
  get sessionSizeLimit(): number {
    return this.server.sessionSizeLimit/1024/1024;
  }

  set sessionSizeLimit(newValue: number) {
    this.server.sessionSizeLimit = newValue *1024*1024;
  }
  
  ngOnInit() {
    this.refreshData();
  }

  refreshData(){
    this.rpcService.getServer(data =>{
      this.server = data;
      this.serverNoModify = Object.assign({}, this.server);
    });
  }

  update(){
    let objCopy = Object.assign({}, this.server);
    delete objCopy["reporttoken"];
    this.rpcService.updateServer((success)=>success?this.refreshData():'', objCopy);    
  }

  hasModifications(){
    for(var propertyName in this.server)
    {
      if(this.server[propertyName] != this.serverNoModify[propertyName])
      {
        return true;
      }
    }
    return false;
  }

}
