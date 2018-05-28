import { Component, OnInit, Input } from '@angular/core';
import { RpcService } from '../rpc.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  items = [];
  keys = []
  selectedRow : number;
  @Input() sessionId = null;
   //sessionIdParent: string;

  constructor(private rpcService: RpcService) {
    this.keys = this.rpcService.getUserKeys();
    this.selectedRow = null;
  }

  refreshData(){
    let updater = data => {
      this.items = data;
      this.selectedRow = null;
    }
    if(this.sessionId){
      this.rpcService.getUsersInSession(updater, this.sessionId);
    }
    else{
      this.rpcService.getUsers(updater);
    }
  }

  selectedItem(){
    return this.items[this.selectedRow]
  }

  setClickedRow(index) {
    if (this.selectedRow == index) {
      this.selectedRow = null;
    }
    else {
      this.selectedRow = index;
    }
  }

  hasSelectedRow(){
    return this.selectedRow !== null;
  }

  ngOnInit() {
    this.refreshData();
  }

  message(){
    let item = this.selectedItem();
    var messageStr = prompt("Message to send", "");
    if (messageStr != null) {
      this.rpcService.messageUser(messageStr, this.sessionId, item.id);
    }
  }
  kick(){
    let item = this.selectedItem();    
    if(confirm('Do you want to kick user: ' + item.name))
    {
      this.rpcService.kickUser((success)=> success? this.refreshData(): '', this.sessionId, item.id);
    }    
  }
}
