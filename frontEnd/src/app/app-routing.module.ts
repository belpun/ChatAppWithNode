import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatComponent } from './chat/chat.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
      RouterModule.forRoot([
        {path: '', redirectTo: 'login', pathMatch: 'full'},
        {path: 'chat', component: ChatComponent},
        {path: 'chat/user/:email', component: ChatComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'login', component: LoginComponent}
      ])
    ],
    exports: [
      RouterModule
    ]
})
export class AppRoutingModule { }

