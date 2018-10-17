// defining app logic in a different file

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// add components that want to add to each route w/o ts
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './auth/login/login.component';
import{SignupComponent} from'./auth/signup/signup.component';
import { GroupComponent } from './group/group.component';

// routes are objects of type routes that allow url to have components to be presented
const routes: Routes = [
  // empty path is main page
  { path: "", component: LoginComponent },
  { path: "signup", component: SignupComponent},
  {path:"",component:GroupComponent,outlet:"group"},
 { path: "", component: ChatComponent,outlet:"chat"}
];

// allows use of imports  and allows one to send out exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}


//  more on routes
/*
These routes are different from the ones on app.js...

app.js handling requests sending data through url routes

app-routing.module.ts is rerendering the page through url routes


*/
