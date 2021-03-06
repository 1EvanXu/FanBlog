import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EditorMdComponent} from './editor-md/editor-md.component';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {MarkdownEditorService, SaveStatus} from '../../services/markdown-editor.service';
import {ArticlePublishFormComponent} from './article-publish-form/article-publish-form.component';
import {TempDraft} from '../../data-model/draft';
import {ActivatedRoute, Router} from '@angular/router';
import {ImageUploadModalComponent} from './image-upload-modal/image-upload-modal.component';
import {User} from '../../data-model/user';
import {AuthService} from '../../services/auth.service';

@Component({
  template: `
    <nav class="editor-nav">
      <nz-tooltip [nzTitle]="'Back to Management'" [nzPlacement]="'bottomLeft'">
        <button nz-button nz-tooltip [nzType]="'default'" [nzSize]="'small'" style="position: relative; left: 30px" (click)="backToManagement()">
          <i class="anticon anticon-menu-fold" style="font-size: 15px;"></i>
        </button>
      </nz-tooltip>
      <span style="font-size: 17px;font-weight: bold; margin-left: 50px">
        Markdown Editor
      </span>
      <nz-avatar class="user-avatar" [nzSize]="'small'" [nzIcon]="'user'" [nzSrc]="user.avatarUrl"></nz-avatar>
    </nav>
    <div style="padding: 10px 25px; background-color: whitesmoke">
      <div nz-row>
        <div nz-col [nzSpan]="23">
          <nz-input [nzSize]="'large'" [(ngModel)]="title">
            <ng-template #addOnAfter>
              <button nz-button [nzSize]="'large'" [nzType]="'primary'"
                      (click)="showArticlePublishModal()">Publish</button>
            </ng-template>
          </nz-input>
        </div>

        <div nz-col [nzSpan]="1" [ngSwitch]="saveStatusOfTmpDraft">
          <span  *ngSwitchCase="'SAVED'">
            <i class="anticon anticon-check-circle save-flag saved"></i>
          </span>
          <span  *ngSwitchCase="'UNSAVED'" >
            <i class="anticon anticon-close-circle save-flag unsaved"></i>
          </span>
          <span  *ngSwitchCase="'SAVING'">
            <i class="anticon anticon-loading-3-quarters anticon-spin save-flag saving"></i>
          </span>
        </div>
      </div>
    </div>
    <app-editor-md (saveAction)="manualSaveDraftContent()" (uploadImgAction)="showUploadImgModal()" [mdContent]="loadedMarkdownContent" (mdContentChange)="detectContentChanges()">
    </app-editor-md>
  `,
  styles: [`
    .editor-nav {
      height: 54px;
      padding: 13px;
      border-bottom: lightgray solid 1px;
    }
    :host ::ng-deep .ant-input-group-addon {
      padding: 0px;
    }
    :host ::ng-deep .ant-input {
      font-size: 18px;
      font-weight: bold;
    }
    :host ::ng-deep .ant-input-lg {
      height: 38px;
    }
    :host ::ng-deep .ant-btn-lg {
      height: 36px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    .save-flag {
      font-size: 18px;
      margin: 10px 8px
    }
    .saved {
      color: forestgreen;
    }
    .unsaved {
      color: orangered;
    }
    .saving {
      color: dodgerblue;
    }
    .user-avatar {
      position: absolute;
      right: 15px;
      top: 15px;
    }
  `]
})
export class MarkdownEditorComponent implements OnInit {
  tempDraftId: number;
  draftId: number;
  loadedMarkdownContent: string;
  OutputMarkdownContent: string;
  title: string;

  saveStatusOfTmpDraft = SaveStatus.UNKNOWN;
  saveStatusOfDraft = SaveStatus.UNKNOWN;

  tempDraft: TempDraft = new TempDraft();
  @ViewChild(EditorMdComponent) private editorMdComponent: EditorMdComponent;

  user: User;

  backToManagement() {
    this.router.navigate(['/management']);
  }

  canPublish(): boolean {
    if (!this.isValidTitle(this.title)) {
      this._nzMessageService.warning('The length of title must between 3 and 30!');
      return false;
    }
    if (this.saveStatusOfDraft !== SaveStatus.SAVED) {
      this._nzMessageService.warning('Auto save not completed!');
      return false;
    }

    if (this.saveStatusOfTmpDraft !== SaveStatus.SAVED) {
      this._nzMessageService.warning('Unsaved!');
      return false;
    }
    return true;
  }

  canDeactivate(): boolean {
    return this.saveStatusOfDraft === SaveStatus.SAVED && this.saveStatusOfTmpDraft === SaveStatus.SAVED;
  }


  isValidTitle(title: string): boolean {
    if (title === undefined) {
      return false;
    }
    const len = title.length;
    return len >= 3 && len < 30;
  }

  ngOnInit() {
    const currentUrl = this.router.url;

    if (currentUrl.match('editor/article/new$')) {
      this._mdEditorService.writeArticle().subscribe(
        value => this.tempDraftId = value
      );
    } else if (currentUrl.match('editor/article/\\d+$')) {
      this.route.paramMap.subscribe(
        param => {
          this.draftId = +param.get('articleId');
          this.loadDraftContent(this.draftId);
        }
      );
    }

    this.autoSaveDraftContent();
  }

  detectContentChanges() {
    this.saveStatusOfTmpDraft = SaveStatus.SAVING;
  }

  private getHtmlContent(): string {
    return this._el.nativeElement.querySelector('.editormd-preview-container').innerHTML.toString();
  }

  manualSaveDraftContent() {

    if (!this.OutputMarkdownContent || !this.title || this.OutputMarkdownContent.length === 0 || this.title.length === 0) {
      this._nzMessageService.warning('Title and Content can\'t be empty!');
      return;
    }
    // console.log('Manual Save', this.saveStatusOfDraft);
    this.detectContentChanges();

    const draft: TempDraft  = new TempDraft();
    draft.htmlContent = this.getHtmlContent();
    draft.tempDraftId = this.tempDraftId;
    draft.id = this.draftId;
    // console.log(draft);
    this._mdEditorService.saveArticle(draft).subscribe(
      value => {
        if (value) {
          this.draftId = value;
          this.saveStatusOfDraft = SaveStatus.SAVED;
          this.saveStatusOfTmpDraft = SaveStatus.SAVED;
        } else {
          this.saveStatusOfDraft = SaveStatus.UNSAVED;
        }

      },
      () => this.saveStatusOfDraft = SaveStatus.UNSAVED
    );
  }

  autoSaveDraftContent() {
    this.editorMdComponent.mdContentChange$.pipe(
      debounceTime(3000),
      distinctUntilChanged(),
      switchMap(value =>  {
        this.OutputMarkdownContent = value;
        return this._mdEditorService.saveArticleMarkdownContent(this.getTmpDraft());
      })).subscribe(
        value => this.saveStatusOfTmpDraft = value,
        () => this.saveStatusOfTmpDraft = SaveStatus.UNSAVED,
    );
  }

  getTmpDraft(): TempDraft {
    this.tempDraft.tempDraftId = this.tempDraftId;
    this.tempDraft.markdownContent = this.OutputMarkdownContent;
    this.tempDraft.id = this.draftId;
    this.tempDraft.title = this.title;
    return this.tempDraft;
  }

  getDraft(): TempDraft {
    this.getTmpDraft();
    this.tempDraft.markdownContent = this.editorMdComponent.getMarkContent();
    // console.log(this.tempDraft);
    return this.tempDraft;
  }

  loadDraftContent(articleId: number) {
    this._mdEditorService.getArticle(articleId).subscribe(
      data => {
          // console.log(data);
          this.tempDraft = data;
          this.loadedMarkdownContent = data.markdownContent;
          this.title = data.title;
      },
      () => { console.error('Some error happened!'); }
    );
  }

  showArticlePublishModal() {
    if (!this.canPublish()) {
      return;
    }
    const subscription = this._nzModalService.open({
      title: 'Publish Article',
      content: ArticlePublishFormComponent,
      footer: false,
      componentParams: {
        articleTitle: this.title,
        articleId: this.draftId
      }
    });
    // subscription.subscribe(res => console.log(res));
  }

  showUploadImgModal() {
    // console.log('show upload image modal!');
    this._nzModalService.open({
      title: 'Upload Image',
      content: ImageUploadModalComponent,
      footer: false,
    });
  }

  constructor(
    private _mdEditorService: MarkdownEditorService,
    private _nzModalService: NzModalService,
    private _nzMessageService: NzMessageService,
    private _el: ElementRef,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.user = this.authService.getUserFromCookie();
  }
}

