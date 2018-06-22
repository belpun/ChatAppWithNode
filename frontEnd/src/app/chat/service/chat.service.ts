import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from 'selenium-webdriver/http';
import { User } from '../../entity/user';
import { Message } from '../../entity/message';

@Injectable()
export class ChatService {

  constructor(private socket: Socket, private http: HttpClient) { }

  // sendMessage(msg: string) {
  //     this.socket.emit('message', msg);
  // }

  registerForMessage() {
    this.socket.emit('message', {username: localStorage.getItem('email')});
  }

  getMessage(): Observable<Message> {
      return this.socket
          .fromEvent<Message>('message');
  }

  addNewOnlineUser() {
    return this.socket
        .fromEvent<User>('newOnlineUser');
}

  addNewOfflineUser() {
    return this.socket
        .fromEvent<User>('newOfflineUser');
}

 getAllMessages(to) {
    return this.http.get<Message[]>(`http://bita-lpt24:3000/api/messages/${localStorage.getItem('email')}/${to}`).toPromise();
  }

  getAllOnlineUsers() {
    console.log('called getAllOnlineUsers');
    return this.http.get<User[]>('http://bita-lpt24:3000/api/onlineUsers');
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>('http://bita-lpt24:3000/api/messages', message);
  }
}
