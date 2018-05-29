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
  session?: string,
  user?: string,
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
  reporttoken?: string,
  logpurgedays?: Number,
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
  session?: string,
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


  /* // Below is a massive chunk of code that lets users test the UI without actually Running the browser
  bans: BanMessage[] = [
    {
        "added": "2018-05-26 22:22:50",
        "comment": "added 5/26/2018 3:22 \nexpire 5/27/2018 3:22 ",
        "expires": "2018-05-27 15:22:19",
        "id": 2,
        "ip": "192.168.99.100",
        "subnet": 0
    },
    {
        "added": "2018-05-27 05:05:10",
        "comment": "asdf",
        "expires": "2018-05-28 05:05:03",
        "id": 3,
        "ip": "192.168.99.101",
        "subnet": 0
    },
    {
        "added": "2018-05-27 07:45:58",
        "comment": "",
        "expires": "2018-05-28 07:45:52",
        "id": 4,
        "ip": "192.168.99.102",
        "subnet": 0
    }
];
  accounts: AccountMessage[] = [
    {
        "flags": "HOST,MOD",
        "id": 1,
        "locked": false,
        "username": "beta1042"
    },
    {
        "flags": "HOST,MOD",
        "id": 3,
        "locked": false,
        "username": "zero"
    },
    {
        "flags": "HOST,MOD",
        "id": 4,
        "locked": false,
        "username": "knic"
    },
    {
        "flags": "MOD,HOST",
        "id": 25,
        "locked": false,
        "username": "soap"
    },
    {
        "flags": "",
        "id": 27,
        "locked": false,
        "username": "asdf"
    }
];
  logs: LogMessage[] = [
    {
        "level": "Info",
        "message": "New client connected",
        "timestamp": "2018-05-29T04:27:44Z",
        "topic": "Status",
        "user": "0;1.23.45.123;"
    },
    {
        "level": "Debug",
        "message": "init-complete",
        "session": "{68ee60d1-752f-4082-95bc-1427888dad3f}",
        "timestamp": "2018-05-29T03:55:01Z",
        "topic": "Status",
        "user": "1;1.23.45.123;knic"
    },
    {
        "level": "Info",
        "message": "Changed title, changed max. user count",
        "session": "{68ee60d1-752f-4082-95bc-1427888dad3f}",
        "timestamp": "2018-05-29T03:55:01Z",
        "topic": "Status",
        "user": "1;1.23.45.123;knic"
    },
    {
        "level": "Info",
        "message": "Joined session",
        "session": "{68ee60d1-752f-4082-95bc-1427888dad3f}",
        "timestamp": "2018-05-29T03:55:01Z",
        "topic": "Join",
        "user": "1;1.23.45.123;knic"
    },
    {
        "level": "Info",
        "message": "Session created by knic",
        "session": "{68ee60d1-752f-4082-95bc-1427888dad3f}",
        "timestamp": "2018-05-29T03:55:01Z",
        "topic": "Status"
    },
    {
        "level": "Info",
        "message": "New client connected",
        "timestamp": "2018-05-29T03:55:00Z",
        "topic": "Status",
        "user": "0;1.23.45.123;"
    }
];
  server: ServerMessage = {
    "allowGuestHosts": true,
    "allowGuests": true,
    "announceWhitelist": false,
    "archive": true,
    "clientTimeout": 120,
    "extauth": false,
    "extauthfallback": true,
    "extauthgroup": "",
    "extauthkey": "",
    "extauthmod": true,
    "idleTimeLimit": 300000,
    "persistence": true,
    "privateUserList": false,
    "serverTitle": "Welcome to Beta1042's house!!!",
    "sessionCountLimit": 25,
    "sessionSizeLimit": 92274688,
    "welcomeMessage": ""
};
  sessions: SessionMessage[] = [
    {
        "alias": "",
        "authOnly": false,
        "closed": false,
        "founder": "beta1042",
        "hasPassword": true,
        "id": "0f44ebf9-e262-4ba5-8402-2d615d3c5848",
        "maxUserCount": 20,
        "nsfm": false,
        "persistent": true,
        "protocol": "dp:4.20.1",
        "size": 12111547,
        "startTime": "2018-05-23T06:19:02Z",
        "title": "tapas",
        "userCount": 0
    },
    {
        "alias": "",
        "authOnly": false,
        "closed": false,
        "founder": "beta1042",
        "hasPassword": true,
        "id": "d033155f-c7ba-4caa-a472-8d77f7312862",
        "maxUserCount": 20,
        "nsfm": false,
        "persistent": true,
        "protocol": "dp:4.20.1",
        "size": 10944071,
        "startTime": "2018-05-20T07:31:31Z",
        "title": "tapas2",
        "userCount": 0
    },
    {
        "alias": "",
        "authOnly": false,
        "closed": false,
        "founder": "beta1042",
        "hasPassword": true,
        "id": "16b081f1-ee4c-46a7-8c07-19d9f8a0d092",
        "maxUserCount": 20,
        "nsfm": false,
        "persistent": true,
        "protocol": "dp:4.20.1",
        "size": 6026299,
        "startTime": "2018-05-28T06:48:06Z",
        "title": "Fun",
        "userCount": 0
    },
    {
        "alias": "",
        "authOnly": false,
        "closed": false,
        "founder": "knic",
        "hasPassword": false,
        "id": "68ee60d1-752f-4082-95bc-1427888dad3f",
        "maxUserCount": 20,
        "nsfm": false,
        "persistent": false,
        "protocol": "dp:4.20.1",
        "size": 45227,
        "startTime": "2018-05-29T03:55:01Z",
        "title": "draw",
        "userCount": 1
    }
]
;
  status: StatusMessage = {
    "maxSessions": 25,
    "sessions": 4,
    "started": "2018-03-15 05:19:27",
    "users": 2
};
  users: UserMessage[] = [
    {
        "auth": true,
        "id": 0,
        "ip": "1.23.45.123",
        "mod": true,
        "muted": false,
        "name": "knic",
        "op": true,
        "tls": true
    },
    {
        "auth": true,
        "id": 1,
        "ip": "1.23.45.123",
        "mod": true,
        "muted": false,
        "name": "knic",
        "op": true,
        "session": "68ee60d1-752f-4082-95bc-1427888dad3f",
        "tls": true
    }
];


generateId(objects: any[]){
  let maxId = 1;
  for(let object of objects)
  {
    maxId = object.id > maxId? object.id : maxId;
  }
  return maxId + 1
}

insertWithGeneratedId<T>(objects: T[], newObject: any)
{
  let newObjectCopy = Object.assign({}, newObject);   
  newObjectCopy['id'] = this.generateId(objects);
  objects.push(newObjectCopy)
}

deleteById<T>(objects:T[], id)
{
  for(var i = objects.length - 1; i >= 0; i--) {
    if(objects[i]['id'] == id) {
      objects.splice(i, 1);
      return;
    }
  }
}

getItemById<T>(objects: T[], id)
{
  for(let object of objects)
  {
    if(object['id'] == id)
    {
      return object;
    }
  }
}

updateAllFields(src:any, dest: any)
{
  for(var x in src)
  {
    dest[x] = src[x];
  }
}

  copy<T>(obj:T)
  {
    return Object.assign({}, obj); 
  }
  copyArr<T>(objs:T[])
  {
    let objsCopy = []
    for(let obj of objs){
      objsCopy.push(this.copy(obj))
    }
    return objsCopy;
  }

  getBans(successCallback: (message: BanMessage[]) => void) {
    successCallback(this.copyArr(this.bans));
  }  

  addBan(callback: (isSuccess: Boolean) => void, ban: any){
    toastr["success"]("Added ban: " + ban.ip);
    this.insertWithGeneratedId(this.bans, ban);
    callback(true);
  }

  deleteBan(callback: (isSuccess: Boolean) => void, ban){
    this.deleteById(this.bans, ban.id);
    toastr["success"]('Removed ban: ' + ban.ip);
    callback(true);
  }

  getAccounts(successCallback: (message: AccountMessage[]) => void) {
    successCallback(this.copyArr(this.accounts));
  }
  
  addAccount(callback: (isSuccess: Boolean) => void, account: any){
    toastr["success"]("Added ban: " + account.name);
    this.insertWithGeneratedId(this.accounts, account);
    callback(true);
  }
  
  updateAccount(callback: (isSuccess: Boolean) => void, account: any){
    this.updateAllFields(account, this.getItemById(this.accounts, account.id));
    toastr["success"]("Updated account: " + account.username);
    callback(true);
  }

  deleteAccount(callback: (isSuccess: Boolean) => void, account){
    this.deleteById(this.accounts, account.id);
    toastr["success"]('deleted account ' + account.username);
    callback(true);
  }

  getLogs(successCallback: (message: LogMessage[]) => void) {
    successCallback(this.copyArr(this.logs));
  }
  getServer(successCallback: (message: ServerMessage) => void) {
    successCallback(this.copy(this.server));
  }
  updateServer(callback: (isSuccess: Boolean) => void, server: any){
    this.updateAllFields(server, this.server);
    toastr["success"]('Updated server');
  }
  deleteSession(id: String){
    this.deleteById(this.sessions, id);
    toastr["success"]('Terminated session ' + id);
    this.router.navigateByUrl('sessions');
  }
  getSession(successCallback: (message: SessionMessage) => void, id: string) {
    let session = this.copy(this.getItemById(this.sessions, id));
    session['users'] = [];
    for(let user of this.users){
      if(user.session == session.id)
      {
        session['users'].push(this.copy(user))
      }
    }
    successCallback(session);
  }
  messageSession(message: String, id: String) {    
    toastr["success"]( "Sent message");
  }
  updateSession(callback: (isSuccess: Boolean) => void, session: any, sessionId: string){
    this.updateAllFields(session, this.getItemById(this.sessions, sessionId));
    toastr["success"]("Updated session " + sessionId);
    callback(true);
  }
  getSessions(successCallback: (message: SessionMessage[]) => void) {
    successCallback(this.copyArr(this.sessions));
  }
  messageSessions(message: String) {    
    toastr["success"]("Sent message");
  }
  getStatus(successCallback: (message: StatusMessage) => void) {
    successCallback(this.copy(this.status));
  }
  getUsers(successCallback: (message: UserMessage[]) => void) {
    successCallback(this.copyArr(this.users));
  }
  getUsersInSession(successCallback: (message: UserMessage[]) => void, session: string) {
    var users = this.users;
    var callback = (data: any)=> users = data.users;
    this.getSession(callback, session);
    successCallback(users);
  }
  kickUser(callback: (isSuccess: Boolean) => void, sessionId: String, userId: string) {    
    this.getItemById(this.users, userId)['session'] = null;
    toastr["success"]('kicked user: ' + userId);
    callback(true);
  }
  messageUser(message: String, sessionId: String, userId: string) {    
    toastr["success"]( "Sent message");
  } */

}
