export class ArticleItem {
  pubId: number;
  title: string;
  abstract: string;
  pubTime: string;
  type: string;
  category: string;
  visitorCount: number;
  voteCount: number;
  commentaryCount: number;
  link?: string;

  constructor(
    pubId: number,
    title: string,
    abstract: string,
    pubTime: string,
    type: string,
    category: string,
    visitorCount: number,
    voteCount: number,
    commentaryCount: number,
    link?: string) {
    this.pubId = pubId;
    this.title = title;
    this.abstract = abstract;
    this.pubTime = pubTime;
    this.type = type;
    this.category = category;
    this.visitorCount = visitorCount;
    this.voteCount = voteCount;
    this.commentaryCount = commentaryCount;
    this.link = link;
  }
  public static createInstance(object: Object): ArticleItem {
    return new ArticleItem(
      object['pubId'],
      object['title'],
      object['abstract'],
      object['pubTime'],
      object['type'],
      object['category'],
      object['visitorCount'],
      object['voteCount'],
      object['commentaryCount'],
      object['link'],
    );
  }
}
