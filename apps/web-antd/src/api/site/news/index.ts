import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SiteNews {
  export type NewsPublish = 0 | 1;
  export type NewsTop = 0 | 1;

  export interface News {
    id: number;
    title: string;
    subtitle: string;
    date: number | string;
    author: string;
    cover: string;
    contentHtml: string;
    publish: NewsPublish;
    top: NewsTop;
    categoryId: number;
  }

  export interface NewsDTO extends News {
    tags: string[];
  }

  export interface NewsVO extends News {
    tags: NewsTagRelevance[];
  }

  export interface NewsTagRelevance {
    id: number;
    name: string;
    newsId: number;
    tagsId: number;
  }

  export type NewsUpdatePublishDTO = Pick<News, 'id' | 'publish'>;

  export type NewsUpdateTopDTO = Pick<News, 'id' | 'top'>;
}

const NEWS_BASE_URL = 'site/news';

/**
 * 查询新闻列表
 * @param params 查询参数
 */
export function getNewsList(params: PageParam) {
  return requestClient.get<PageResult<SiteNews.NewsVO>>(
    `${NEWS_BASE_URL}/list`,
    {
      params,
    },
  );
}

/**
 * 查询新闻详情
 * @param id 新闻ID
 */
export function getNews(id: number) {
  return requestClient.get<SiteNews.NewsVO>(`${NEWS_BASE_URL}/${id}`);
}

/**
 * 创建新闻
 * @param data 新闻数据
 */
export function createNews(data: SiteNews.NewsDTO) {
  return requestClient.post(NEWS_BASE_URL, data);
}

/**
 * 更新新闻
 * @param data 新闻数据
 */
export function updateNews(data: SiteNews.NewsDTO) {
  return requestClient.put(NEWS_BASE_URL, data);
}

/**
 * 删除新闻
 * @param id 新闻ID
 */
export function deleteNews(id: number) {
  return requestClient.delete(`${NEWS_BASE_URL}/${id}`);
}

/**
 * 更新新闻发布状态
 */
export function updateNewsPublish(data: SiteNews.NewsUpdatePublishDTO) {
  return requestClient.put(`${NEWS_BASE_URL}/publish`, data);
}

/**
 * 更新新闻置顶状态
 * @param data
 */
export function updateNewsTop(data: SiteNews.NewsUpdateTopDTO) {
  return requestClient.put(`${NEWS_BASE_URL}/top`, data);
}
