import type { SupportedLanguagesType } from '@vben/locales';
import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SiteCompanyNews {
  export type NewsPublish = 0 | 1;
  export type NewsTop = 0 | 1;

  export interface CompanyNews {
    id: number;
    lang: SupportedLanguagesType;
    title: string;
    subtitle: string;
    date: number | string;
    author: string;
    cover: string;
    contentHtml: string;
    publish: NewsPublish;
    top: NewsTop;
  }

  export type CompanyNewsUpdatePublishDTO = Pick<CompanyNews, 'id' | 'publish'>;

  export type CompanyNewsUpdateTopDTO = Pick<CompanyNews, 'id' | 'top'>;
}

const COMPANY_NEWS_BASE_URL = 'site/company-news';

/**
 * 获取公司新闻列表
 * @param params 查询参数
 * @returns 公司新闻列表
 */
export function getCompanyNewsList(params: PageParam) {
  return requestClient.get<PageResult<SiteCompanyNews.CompanyNews>>(
    `${COMPANY_NEWS_BASE_URL}/list`,
    {
      params,
    },
  );
}

/**
 * 获取公司新闻详情
 * @param id 公司新闻ID
 * @returns 公司新闻详情
 */
export function getCompanyNews(id: number) {
  return requestClient.get<SiteCompanyNews.CompanyNews>(
    `${COMPANY_NEWS_BASE_URL}/${id}`,
  );
}

/**
 * 创建公司新闻
 * @param data 公司新闻数据
 * @returns 创建结果
 */
export function createCompanyNews(data: SiteCompanyNews.CompanyNews) {
  return requestClient.post(COMPANY_NEWS_BASE_URL, data);
}

/**
 * 更新公司新闻
 * @param data 公司新闻数据
 * @returns 更新结果
 */
export function updateCompanyNews(data: SiteCompanyNews.CompanyNews) {
  return requestClient.put(`${COMPANY_NEWS_BASE_URL}`, data);
}

/**
 * 删除公司新闻
 * @param id 公司新闻ID
 * @returns 删除结果
 */
export function deleteCompanyNews(id: number) {
  return requestClient.delete(`${COMPANY_NEWS_BASE_URL}/${id}`);
}

/**
 * 更新公司新闻发布状态
 * @param data 更新数据
 * @returns 更新结果
 */
export function updateCompanyNewsPublish(
  data: SiteCompanyNews.CompanyNewsUpdatePublishDTO,
) {
  return requestClient.put(`${COMPANY_NEWS_BASE_URL}/publish`, data);
}

/**
 * 更新公司新闻置顶状态
 * @param data 更新数据
 * @returns 更新结果
 */
export function updateCompanyNewsTop(
  data: SiteCompanyNews.CompanyNewsUpdateTopDTO,
) {
  return requestClient.put(`${COMPANY_NEWS_BASE_URL}/top`, data);
}
