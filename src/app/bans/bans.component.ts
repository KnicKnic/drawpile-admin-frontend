import { Component, OnInit } from '@angular/core';
import { RpcService } from '../rpc.service';
import { MatDialog } from '@angular/material';
import { BanAddComponent } from '../ban-add/ban-add.component';

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

  refreshData(){
    this.rpcService.getBans(message => {
      this.items=message
      for(let ban of this.items)
      {
        ban.added = this.parseTime(ban.added);
        ban.expires = this.parseTime(ban.expires);
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
