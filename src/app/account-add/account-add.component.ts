import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RpcService } from '../rpc.service';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.css'],
})
export class AccountAddComponent implements OnInit {
  username = "";
  password = "";
  locked = false;
  moderator = false;
  canHost = false;
  id = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private rpcService: RpcService, public dialogRef: MatDialogRef<AccountAddComponent>) {
    if(data && data.isUpdate)
    {
      this.username = data.username;
      this.locked = data.locked;
      this.canHost = data.flags.includes('HOST');
      this.moderator = data.flags.includes('MOD');
      this.id = data.id;
    }
   }

  ngOnInit() {
  }

  add(){
    let user = {
      username: this.username,
      password: this.password,
      locked: this.locked,
      flags: '',
      id: this.id
    }
    let f = [];
    if(this.moderator)
    {
      f.push('MOD');
    }
    if(this.canHost)
    {
      f.push('HOST');
    }
    user.flags = f.join(',');
    if(this.isUpdate())
    {
      this.rpcService.updateAccount((success)=>success?this.closeDialog(true): '', user);
    }
    else{
      this.rpcService.addAccount((success)=>success?this.closeDialog(true): '', user);
    }
  }

  isUpdate(){
    return this.id !== null;
  }

  cancel(){
    this.closeDialog(false);
  }
  
  closeDialog(success: Boolean) {
    this.dialogRef.close(success);
  }

}
