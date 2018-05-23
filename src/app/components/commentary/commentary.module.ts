import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommentaryBoxComponent, CommentaryItemComponent} from './commentary-box/commentary-box.component';
import {CommentaryComponent, CommentaryListComponent} from './commentary-list/commentary-list.component';
import {CommentAlertComponent, CommentComponent} from './comment/comment.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {CommentaryService} from '../../services/commentary.service';
import { CommentariesDirective } from './commentaries.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule.forRoot()
  ],
  declarations: [
    CommentaryBoxComponent,
    CommentaryItemComponent,
    CommentaryListComponent,
    CommentaryComponent,
    CommentComponent,
    CommentariesDirective,
    CommentAlertComponent
  ],
  exports: [
    CommentComponent,
    CommentaryComponent,
  ],
  providers: [CommentaryService],
  entryComponents: [CommentaryListComponent]
})
export class CommentaryModule { }
