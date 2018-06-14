
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ErrorComponent } from './nodes/error/error.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {BlogModule} from './nodes/blog/blog.module';
import {ManagementModule} from './nodes/management/management.module';
import {MarkdownEditorModule} from './nodes/markdown-editor/markdown-editor.module';
import { HumanizationPipe } from './components/pipes/humanization.pipe';
import {UserService} from './services/user.service';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HumanizationPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    NgZorroAntdModule.forRoot(),
    BlogModule,
    ManagementModule,
    MarkdownEditorModule,
    AppRoutingModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
