import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GroupComponent } from './group/group.component';
import {
  MatInputModule,
   MatCardModule,
   MatButtonModule,
   MatToolbarModule,
   MatExpansionModule,
   MatProgressSpinnerModule,
   MatPaginatorModule,
   MatDialogModule,
   MatFormFieldModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatComponent } from './chat/chat.component';
import { FormsModule } from '../../node_modules/@angular/forms';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupComponent,
    ChatComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
