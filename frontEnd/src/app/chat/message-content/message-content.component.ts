import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../service/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Message } from '../../entity/message';
import { User } from '../../entity/user';

@Component({
  selector: 'app-message-content',
  templateUrl: './message-content.component.html',
  styleUrls: ['./message-content.component.css']
})
export class MessageContentComponent implements OnInit {

  constructor(private chatService: ChatService, private sb: MatSnackBar) { }

  @Input()
  to: User;

  message: string;

  messages: Message[] = [];

  ngOnInit() {

        if (this.to) {
          this.chatService.getAllMessages(this.to.email).then(msgs => {
            this.messages = msgs as any[];
          }).catch( error => {
            this.sb.open('Error Getting the messages', 'close', {duration: 2000});
          }) ;
        }
  }

  submit() {

    const message = new Message();
    message.from = localStorage.getItem('email');
    message.to = this.to.email;
    message.name = localStorage.getItem('name');
    message.message = this.message;

    this.chatService.sendMessage(message).subscribe(returnedMsg => {
      // this.messages.push(returnedMsg);
      this.message = '';
    }
    );

  }

  addMessage(message: Message) {
    console.log('message was received from websocket');
    this.messages.push(message);
  }

}
