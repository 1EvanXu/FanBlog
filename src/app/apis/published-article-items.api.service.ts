import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BASE_API_URL} from './common-api.config';
import {PublishedArticleItemCollection} from '../data-model/article-item';
import {BlogResponseResult} from '../data-model/blog-response-result';
import {catchError, map} from 'rxjs/operators';
import {RequestErrorHandlerService} from '../services/request-error-handler.service';

@Injectable()
export class PublishedArticlesItemsApiClient {
  private _baseUrl = BASE_API_URL + 'articles/';

  constructor(private _http: HttpClient, private errorHandler: RequestErrorHandlerService) { }

  getAllPublishedArticleItems(pageIndex: number): Observable<PublishedArticleItemCollection> {
    const requestUrl = this._baseUrl + `items/p/${pageIndex}`;
    return this._http.get<BlogResponseResult>(requestUrl).pipe(
      map(value => value.data),
      catchError(this.errorHandler.handleError));

  }

  getPublishedArticleItemsByCategory(categoryId: number, pageIndex: number): Observable<PublishedArticleItemCollection> {
    const requestUrl = this._baseUrl + `items/p/${pageIndex}?categoryId=${categoryId}`;
    return this._http.get<BlogResponseResult>(requestUrl).pipe(map(value => value.data));
  }

  getPublishedArticleItemsBySearch(keywords: string, pageIndex: number): Observable<PublishedArticleItemCollection> {
    const requestUrl = this._baseUrl + `items/p/${pageIndex}?keywords=${keywords}`;
    return this._http.get<PublishedArticleItemCollection>(requestUrl);
  }
}
