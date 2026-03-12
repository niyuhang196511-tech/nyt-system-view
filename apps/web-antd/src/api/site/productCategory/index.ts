import type { SupportedLanguagesType } from '@vben/locales';
import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SiteProductCategoryAPI {
  export type OperatingState = 0 | 1;
  export interface ProductCategory {
    id: number;
    sort: number;
    state: OperatingState;
    langs: ProductCategoryLang[];
    // 拓展以下两个字段 用于表格展示
  }

  export interface ProductCategoryVO extends ProductCategory {
    name?: string;
  }

  export interface ProductCategoryLang {
    id: number;
    lang: SupportedLanguagesType;
    name: string;
    description: string;
  }
}

const PRODUCT_CATEGORY_BASE_URL = '/site/product-category';

/**
 * 查询所有产品分类
 */
export function getProductCategoryAll() {
  return requestClient.get<Array<SiteProductCategoryAPI.ProductCategory>>(
    `${PRODUCT_CATEGORY_BASE_URL}/all`,
  );
}

/**
 * 查询产品分类列表
 * @param params
 */
export function getProductCategoryList(params: PageParam) {
  return requestClient.get<PageResult<SiteProductCategoryAPI.ProductCategory>>(
    `${PRODUCT_CATEGORY_BASE_URL}/list`,
    { params },
  );
}

/**
 * 查询产品分类详情
 * @param id 分类ID
 */
export function getProductCategory(id: number) {
  return requestClient.get<SiteProductCategoryAPI.ProductCategory>(
    `${PRODUCT_CATEGORY_BASE_URL}/${id}`,
  );
}

/**
 * 新增产品分类
 * @param data 分类数据
 */
export function createProductCategory(
  data: SiteProductCategoryAPI.ProductCategory,
) {
  return requestClient.post(PRODUCT_CATEGORY_BASE_URL, data);
}

/**
 * 修改产品分类
 * @param data 分类数据
 */
export function updateProductCategory(
  data: SiteProductCategoryAPI.ProductCategory,
) {
  return requestClient.put(PRODUCT_CATEGORY_BASE_URL, data);
}

/**
 * 删除产品分类
 * @param id 分类ID
 */
export function deleteProductCategory(id: number) {
  return requestClient.delete(`${PRODUCT_CATEGORY_BASE_URL}/${id}`);
}

export function updateProductCategoryState(id: number, state: 0 | 1) {
  return requestClient.put(`${PRODUCT_CATEGORY_BASE_URL}/state`, {
    id,
    state,
  });
}
