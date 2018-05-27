import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users = [];
  selectedRow: number;
  setClickedRow: Function;
  keys = []

  constructor(private rpcService: RpcService) {
    this.keys = this.rpcService.getUserKeys();
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
    this.rpcService.getUsers(data => this.users = data);
    this.selectedRow = null;
  }
  ngOnInit() {
    this.refreshData();
  }

}
