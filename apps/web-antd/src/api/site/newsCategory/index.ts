import type { SupportedLanguagesType } from '@vben/locales';
import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SiteNewsCategoryAPI {
  export interface NewsCategory {
    id: number;
    langs: NewsCategoryLang[];
    // 拓展以下两个字段 用于表格展示
  }

  export interface NewsCategoryVO extends NewsCategory {
    name?: string;
  }

  export interface NewsCategoryLang {
    id: number;
    lang: SupportedLanguagesType;
    name: string;
    description: string;
  }
}

const NEWS_CATEGORY_BASE_URL = '/site/news-category';

/**
 * 查询所有新闻资讯分类
 */
export function getNewsCategoryAll() {
  return requestClient.get<Array<SiteNewsCategoryAPI.NewsCategory>>(
    `${NEWS_CATEGORY_BASE_URL}/all`,
  );
}

/**
 * 查询新闻资讯分类列表
 * @param params
 */
export function getNewsCategoryList(params: PageParam) {
  return requestClient.get<PageResult<SiteNewsCategoryAPI.NewsCategory>>(
    `${NEWS_CATEGORY_BASE_URL}/list`,
    { params },
  );
}

/**
 * 查询新闻资讯分类详情
 * @param id 分类ID
 */
export function getNewsCategory(id: number) {
  return requestClient.get<SiteNewsCategoryAPI.NewsCategory>(
    `${NEWS_CATEGORY_BASE_URL}/${id}`,
  );
}

/**
 * 新增新闻资讯分类
 * @param data 分类数据
 */
export function createNewsCategory(data: SiteNewsCategoryAPI.NewsCategory) {
  return requestClient.post(NEWS_CATEGORY_BASE_URL, data);
}

/**
 * 修改新闻资讯分类
 * @param data 分类数据
 */
export function updateNewsCategory(data: SiteNewsCategoryAPI.NewsCategory) {
  return requestClient.put(NEWS_CATEGORY_BASE_URL, data);
}

/**
 * 删除新闻资讯分类
 * @param id 分类ID
 */
export function deleteNewsCategory(id: number) {
  return requestClient.delete(`${NEWS_CATEGORY_BASE_URL}/${id}`);
}
