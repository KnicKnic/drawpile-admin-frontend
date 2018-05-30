import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RpcService } from '../rpc.service';
import { ParseAndFormatTime } from '../utilities';


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

  ngOnInit() {
    this.rpcService.getStatus(data => {
      this.status = data;
      this.status.started = ParseAndFormatTime(this.status.started);
    });
  }
}
