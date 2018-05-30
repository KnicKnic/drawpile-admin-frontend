import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';
import { MatDialog } from '@angular/material';
import { BanAddComponent } from '../ban-add/ban-add.component';
import { ParseAndFormatTime } from '../utilities';

@Component({
  selector: 'app-bans',
  templateUrl: './bans.component.html',
  styleUrls: ['./bans.component.css']
})
export class BansComponent implements OnInit {
  items = [];
  selectedRow : number;
  keys = []
  addUpdateComponent = BanAddComponent;

  constructor(private rpcService: RpcService, public dialog: MatDialog) {
    this.keys = this.rpcService.getBanKeys();
    this.selectedRow = null;
  }

  refreshData(){
    this.rpcService.getBans(message => {
      this.items=message
      for(let ban of this.items)
      {
        ban.added = ParseAndFormatTime(ban.added);
        ban.expires = ParseAndFormatTime(ban.expires);
      }
    });
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
    if(confirm('Do you want to delete ' + this.selectedItem().ip))
    {
      this.rpcService.deleteBan(()=> this.refreshData(), this.selectedItem() );
    }
  }
  hasSelectedRow(){
    return this.selectedRow !== null;
  }

  add() {
    this.dialog.open(this.addUpdateComponent, {
    }).afterClosed().subscribe((success) =>success? this.refreshData():'');
  }
  ngOnInit() {
    this.refreshData();
  }
}
