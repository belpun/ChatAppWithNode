import { AuthService } from './../auth/service/auth.service';
import { Component, OnInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { ChatService } from './service/chat.service';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../entity/user';
import { MessageContentComponent } from './message-content/message-content.component';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  onlineUsers: User[] = [];

  messages: any[] = [];
  selectedUsers: User[] = [];

  @ViewChildren('messageTabs')
  tabComponents: QueryList<MessageContentComponent>;

  constructor(private http: HttpClient, private chatService: ChatService,
    private router: Router, private sb: MatSnackBar, private route: ActivatedRoute,
  private authService: AuthService, private cd: ChangeDetectorRef) {
    console.log('ChatComponent constructed');
   }
  ngOnInit() {
    this.chatService.registerForMessage();
      this.chatService.getAllOnlineUsers().subscribe(allUsers => {
        if (allUsers) {
          this.onlineUsers = allUsers;
        }
      });

      this.chatService.addNewOnlineUser().subscribe(user => {
        this.addUserToCollections(this.onlineUsers, user);

      });
      this.chatService.addNewOfflineUser().subscribe(user => {
        this.removeUserToCollections(this.onlineUsers, user);

      });

      // this.route.params.subscribe(params => {

      //   this.to = params['email'];

      //   if (this.to) {
      //     this.chatService.getAllMessages(this.to).then(msgs => {
      //       this.messages = msgs as any[];
      //     }).catch( error => {
      //       this.sb.open('Error Getting the messages', 'close', {duration: 2000});
      //     }) ;
      //   }

      // });

    this.chatService.getMessage().subscribe(receivedMessage => {
      console.log('new message revieved');
      console.log(receivedMessage);
      this.tabComponents.forEach((comp: MessageContentComponent) => {

        if ((receivedMessage.from === localStorage.getItem('email') && receivedMessage.to === comp.to.email)
          || receivedMessage.from === comp.to.email) {
          comp.addMessage(receivedMessage);
        }

      });

    });
  }

  selectUser(onlineUser) {
    this.addUserToCollections(this.selectedUsers, onlineUser);
    // this.router.navigate(['chat', 'user', onlineUser.email]);
  }


  addUserToCollections(userList: User[], user: User) {

    const index = userList.findIndex(element =>  element.email === user.email);
    if (index === -1) {
      userList.push(user);
    }
  }

  removeUserToCollections(userList: User[], user: User) {
    const index = userList.findIndex(element =>  element.email === user.email);
    if (index !== -1) {
      userList.splice(index, 1);
    }
  }


}
