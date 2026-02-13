import { requestClient } from '#/api/request';

export namespace SiteNewsTag {
  export interface NewsTag {
    id: number;
    name: string;
  }
}

const NEWS_TAG_BASE_URL = '/site/news-tag';

/**
 * 查询所有新闻标签
 */
export function getNewsTagAll() {
  return requestClient.get<Array<SiteNewsTag.NewsTag>>(
    `${NEWS_TAG_BASE_URL}/all`,
  );
}
