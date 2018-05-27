import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';
import { MatDialog } from '@angular/material';
import { AccountAddComponent } from '../account-add/account-add.component';

// import { keys } from 'ts-transformer-keys';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  addUpdateComponent = AccountAddComponent;

  items = [];
  selectedRow: number;
  keys = [];

  constructor(private rpcService: RpcService, public dialog: MatDialog) {
    this.keys = this.rpcService.getAccountKeys();
    this.selectedRow = null;
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
  delete(){
    if(confirm('Do you want to delete ' + this.selectedItem().username))
    {
      this.rpcService.deleteAccount((success) =>success? this.refreshData():'', this.selectedItem() );
    }
  }
  hasSelectedRow(){
    return this.selectedRow !== null;
  }

  add() {
    this.dialog.open(this.addUpdateComponent, {
    }).afterClosed().subscribe((success) =>success? this.refreshData():'');
  }
  update() {
    var item = Object.assign({}, this.selectedItem()); 
    item.isUpdate = true;
    this.dialog.open(this.addUpdateComponent, {
      data: item
    }).afterClosed().subscribe((success) =>success? this.refreshData():'');
  }
  ngOnInit() {
    this.refreshData();
  }

  refreshData(){
    this.rpcService.getAccounts(data => this.items = data);
    this.selectedRow = null;
  }

}
