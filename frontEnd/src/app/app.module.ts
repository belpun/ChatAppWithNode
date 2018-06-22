import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { ChatService } from './chat/service/chat.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatInputModule, MatSnackBarModule, MatToolbarModule } from '@angular/material';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth/service/auth.service';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ExcludeCurrentUserPipe } from './chat/pipe/exclude-current-user.pipe';
import { MessageContentComponent } from './chat/message-content/message-content.component';
import {MatTabsModule} from '@angular/material/tabs';
const config: SocketIoConfig = { url: 'http://bita-lpt24:3000', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    NavBarComponent,
    RegisterComponent,
    LoginComponent,
    ExcludeCurrentUserPipe,
    MessageContentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule
  ],
  providers: [ ChatService, AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
