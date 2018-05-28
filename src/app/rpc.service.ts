import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import 'toastr';
import { Observable } from 'rxjs';
declare var toastr: any;

export interface AccountMessage {
  id: Number;
  username: string;
  locked: Boolean;
  flags: string;
};

export interface BanMessage {
  id: Number,
  ip: string,
  subnet: Number,
  expires: string,
  comment: string,
  added: string,
};

export interface LogMessage {
  timestamp: string,
  level: string,
  topic: string,
  session: string,
  user: string,
  message: string,
};

export interface ServerMessage {
  clientTimeout: Number,
  sessionSizeLimit: Number,
  sessionCountLimit: Number,
  persistence: Boolean,
  allowGuestHosts: Boolean,
  idleTimeLimit: Number,
  serverTitle: string,
  welcomeMessage: string,
  announceWhitelist: Boolean,
  privateUserList: Boolean,
  allowGuests: Boolean,
  archive: Boolean,
  extauth: Boolean,
  extauthkey: string,
  extauthgroup: string,
  extauthfallback: Boolean,
  extauthmod: Boolean,
  reporttoken: string,
  logpurgedays: Number,
};

export interface SessionMessage {
  alias: string,
  authOnly: Boolean,
  closed: Boolean,
  founder: string,
  hasPassword: Boolean,
  id: string,
  maxUserCount: Number,
  nsfm: Boolean,
  persistent: Boolean,
  protocol: string,
  size: Number,
  startTime: string,
  title: string,
  userCount: Number,
};


export interface StatusMessage {
  started: string,
  sessions: Number,
  maxSessions: Number,
  users: Number,
};

export interface UserMessage {
  auth: Boolean,
  id: Number,
  ip: string,
  mod: Boolean,
  muted: Boolean,
  name: string,
  op: Boolean,
  tls: Boolean,
  session: string,
};

@Injectable({
  providedIn: 'root'
})
export class RpcService {
  //baseUrl = 'http://192.168.0.21:9991/http://192.168.0.11:7777/'
  baseUrl = 'rpc/'
  constructor(private http: HttpClient,
    private router: Router,) {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    };
  }
  getAccountKeys() {
    return [
      "id",
      "username",
      "locked",
      "flags",
    ];
  }
  getBanKeys() {
    return [
      "id",
      "ip",
      "subnet",
      "expires",
      "comment",
      "added",
    ];
  }
  getLogKeys() {
    return [
      "timestamp",
      "level",
      "topic",
      "session",
      "user",
      "message",
    ];
  }
  getServerKeys() {
    return [
      "clientTimeout",
      "sessionSizeLimit",
      "sessionCountLimit",
      "persistence",
      "allowGuestHosts",
      "idleTimeLimit",
      "serverTitle",
      "welcomeMessage",
      "announceWhitelist",
      "privateUserList",
      "allowGuests",
      "archive",
      "extauth",
      "extauthkey",
      "extauthgroup",
      "extauthfallback",
      "extauthmod",
      "reporttoken",
      "logpurgedays",
    ];
  }
  getSessionKeys() {
    return [
      "alias",
      "authOnly",
      "closed",
      "founder",
      "hasPassword",
      "id",
      "maxUserCount",
      "nsfm",
      "persistent",
      "protocol",
      "size",
      "startTime",
      "title",
      "userCount",
    ];
  }
  getStatusKeys() {
    return [
      "started",
      "sessions",
      "maxSessions",
      "users",
    ];
  }
  getUserKeys() {
    return [
      "auth",
      "id",
      "ip",
      "mod",
      "muted",
      "name",
      "op",
      "tls",
    ];
  }

  getErrorText(error)
  {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      return '[ ' + error.error.message + ' ]';
    } else {
      return '[ code : ' + error.status + ', body: ' + JSON.stringify(error.error) + ' ]';
    }
  }

  completeRequests<T>(request: Observable<T>, callback: (isSuccess: Boolean) => void, action: string, success?: string)
  {
    request.subscribe(
      (data: T) => {
        callback(true);
        if(success)
        {
          toastr["success"](success);
        }
      }, // success path
      error => {
        callback(false);
        toastr["error"]("Failed to " + action + " url: " + error.url + " with error " + this.getErrorText(error)); // error path
      }
    );
  }

  makeRpcCreateCall<T>(callback: (isSuccess: Boolean) => void, url: string, body: any, success?: string) {
    this.completeRequests(this.http.post<T>(url,body),callback, 'post', success)
  }
  makeRpcUpdateCall<T>(callback: (isSuccess: Boolean) => void, url: string, body: any, success?: string) {
    this.completeRequests(this.http.put<T>(url,body),callback, 'post', success)
  }

  makeRpcDeleteCall<T>(callback: (isSuccess: Boolean) => void, url: string, success?: string) {
    this.completeRequests(this.http.delete<T>(url),callback, 'post', success)
  }

  makeRpcGetCall<T>(successCallback: (message: T) => void, url: string) {
    let request = this.http.get<T>(url).subscribe(
      (data: T) => {
        successCallback(data);
        //toastr["success"](url);
      },
      error => toastr["error"]("Failed to get url: " + url + " with error " + this.getErrorText(error)) // error path
    );
  }

  getBans(successCallback: (message: BanMessage[]) => void) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'banlist');
  }  
  
  addBan(callback: (isSuccess: Boolean) => void, ban: any){
    this.makeRpcCreateCall(callback, this.baseUrl + 'banlist', ban, "Added ban: " + ban.ip);
  }

  deleteBan(callback: (isSuccess: Boolean) => void, ban){
    let url = this.baseUrl + 'banlist/' + ban.id;
    this.makeRpcDeleteCall(callback, url, 'Removed ban: ' + ban.ip);
  }

  getAccounts(successCallback: (message: AccountMessage[]) => void) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'accounts');
  }
  
  addAccount(callback: (isSuccess: Boolean) => void, account: any){
    this.makeRpcCreateCall(callback, this.baseUrl + 'accounts', account, "Created account: " + account.username);
  }
  
  updateAccount(callback: (isSuccess: Boolean) => void, account: any){
    this.makeRpcUpdateCall(callback, this.baseUrl + 'accounts/' + account.id, account, "Updated account: " + account.username);
  }

  deleteAccount(callback: (isSuccess: Boolean) => void, account){
    let url = this.baseUrl + 'accounts/' + account.id;
    this.makeRpcDeleteCall(callback, url, 'deleted account ' + account.username);
  }

  getLogs(successCallback: (message: LogMessage[]) => void) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'log');
  }
  getServer(successCallback: (message: ServerMessage) => void) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'server');
  }
  updateServer(callback: (isSuccess: Boolean) => void, server: any){
    this.makeRpcUpdateCall(callback, this.baseUrl + 'server' , server, "Updated server");
  }
  deleteSession(id: String){
    let url = this.baseUrl + 'sessions/' + id;
    this.makeRpcDeleteCall((isSuccess: Boolean) => {
      if(isSuccess){
        this.router.navigateByUrl('sessions')
      }
    }, url, 'Terminated session: ' + id);
  }
  getSession(successCallback: (message: SessionMessage) => void, id: string) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'sessions/' + id);
  }
  messageSession(message: String, id: String) {    
    this.makeRpcUpdateCall((isSuccess) => {}, this.baseUrl + 'sessions/' + id, {"message": message}, "Sent message");
  }
  updateSession(callback: (isSuccess: Boolean) => void, session: any, sessionId: string){
    this.makeRpcUpdateCall(callback, this.baseUrl + 'sessions/' + sessionId , session, "Updated session " + sessionId);
  }
  getSessions(successCallback: (message: SessionMessage[]) => void) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'sessions');
  }
  messageSessions(message: String) {    
    this.makeRpcUpdateCall((isSuccess) => {}, this.baseUrl + 'sessions', {"message": message}, "Sent message");
  }
  getStatus(successCallback: (message: StatusMessage) => void) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'status');
  }
  getUsers(successCallback: (message: UserMessage[]) => void) {
    this.makeRpcGetCall(successCallback, this.baseUrl + 'users');
  }
  getUsersInSession(successCallback: (message: UserMessage[]) => void, session: string) {
    this.makeRpcGetCall((data: any)=> successCallback(data.users), this.baseUrl + 'sessions/' + session);
  }
  kickUser(callback: (isSuccess: Boolean) => void, sessionId: String, userId: string) {    
    let url = this.baseUrl + 'sessions/' + sessionId + '/' + userId;
    this.makeRpcDeleteCall(callback, url, 'kicked user: ' + userId);
  }
  messageUser(message: String, sessionId: String, userId: string) {    
    this.makeRpcUpdateCall((isSuccess) => {}, this.baseUrl + 'sessions/' + sessionId + '/' + userId, {"message": message}, "Sent message");
  }
}
