import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArticleItemComponent} from '../../components/article-item/article-item.component';
import {ArticlesListComponent} from '../../components/articles-list/articles-list.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {RouterModule, Routes} from '@angular/router';
import {ArticlesComponent} from './articles.component';
import {ArticlesService} from '../../services/articles.service';
import {ArticlesDirective} from './articles.directive';
import {ArticlesRoutingModule} from './articles-routing.module';



@NgModule({
  imports: [
    CommonModule,
    NgZorroAntdModule.forRoot(),
    ArticlesRoutingModule
  ],
  declarations: [
    ArticleItemComponent,
    ArticlesListComponent,
    ArticlesComponent,
    ArticlesDirective
  ],
  providers: [ArticlesService],
  entryComponents: [ArticlesListComponent]
})
export class ArticlesModule { }