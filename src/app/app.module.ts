import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TextControlAppComponent } from './text-control-app/text-control-app.component';
import { DocumentEditorModule } from '@txtextcontrol/tx-ng-document-editor';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TextControlAppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    DocumentEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
