import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RpcService } from '../rpc.service';

@Component({
  selector: 'app-ban-add',
  templateUrl: './ban-add.component.html',
  styleUrls: ['./ban-add.component.css']
})
export class BanAddComponent implements OnInit {

  ip = "";
  subnet = "";
  expireDate = new Date();
  comment = "";

  constructor(private rpcService: RpcService, public dialogRef: MatDialogRef<BanAddComponent>) {
    this.expireDate = new Date(); 
    this.expireDate.setDate(this.expireDate.getDate() + 1);
   }

  ngOnInit() {
  }

  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  formatTime(time: Date) : string{
    // yyyy-MM-dd HH:mm:ss
    // who ever thought that months should go from 0 -> 11 was brain dead
    return time.getUTCFullYear() 
    + '-' + this.pad((time.getUTCMonth()+1),2)
    + '-' + this.pad(time.getUTCDate(),2)
    + ' ' + this.pad(time.getUTCHours(),2)
    + ':' + this.pad(time.getUTCMinutes(),2)
    + ':' + this.pad(time.getUTCSeconds(),2);

  }

  add(){
    let user = {
      ip: this.ip,
      subnet: Number(this.subnet),
      expires: this.formatTime(this.expireDate),
      comment: this.comment,
    }
    this.rpcService.addBan((success)=>success?this.closeDialog(true): '', user);
  }

  isUpdate(){
    return false;
  }

  cancel(){
    this.closeDialog(false);
  }
  
  closeDialog(success: Boolean) {
    this.dialogRef.close(success);
  }
}
