import type { SupportedLanguagesType } from '@vben/locales';
import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SiteProductAPI {
  export type OperatingState = 0 | 1;
  export type ProductRecommend = 0 | 1;

  export interface Product {
    id: number; // 产品ID
    sort: number; // 排序字段
    categoryId: number; // 分类ID
    recommend: ProductRecommend; // 是否推荐
    state: OperatingState; // 产品状态
    langs: ProductLang[]; // 多语言数据
  }

  export interface ProductVO extends Product {
    name: string;
  }

  export interface ProductLang {
    id: number; // 语言数据ID
    lang: SupportedLanguagesType; // 语言类型
    name: string; // 产品名称
    description: string; // 产品描述
    productId: number; // 产品ID
    cover: string; // 封面图片
    heroVideo: string; // 首屏视频
    colorPage: string; // 彩页
    characteristics: Characteristic[]; // 产品特点
    videos: Video[]; // 产品视频
  }

  export interface Characteristic {
    id: number; // 特点ID
    langId: number; // 语言数据ID
    name: string; // 特点
  }

  export interface Video {
    id: number; // 视频ID
    langId: number; // 语言数据ID
    title: string; // 视频标题
    address: string; // 视频地址
  }

  export type ProductUpdateRecommend = Pick<Product, 'id' | 'recommend'>;

  export type ProductUpdateState = Pick<Product, 'id' | 'state'>;
}

const PRODUCT_BASE_URL = '/site/product';

/**
 * 查询产品列表
 * @param params 查询参数
 */
export function getProductList(params: PageParam) {
  return requestClient.get<PageResult<SiteProductAPI.Product>>(
    `${PRODUCT_BASE_URL}/list`,
    { params },
  );
}

/**
 * 查询产品详情
 * @param id
 */
export function getProduct(id: number) {
  return requestClient.get<SiteProductAPI.Product>(`${PRODUCT_BASE_URL}/${id}`);
}

/**
 * 新增产品信息
 * @param data
 */
export function createProduct(data: SiteProductAPI.Product) {
  return requestClient.post(PRODUCT_BASE_URL, data);
}

/**
 * 修改产品信息
 * @param data
 */
export function updateProduct(data: SiteProductAPI.Product) {
  return requestClient.put(PRODUCT_BASE_URL, data);
}

/**
 * 删除产品信息
 * @param id
 */
export function deleteProduct(id: number) {
  return requestClient.delete(`${PRODUCT_BASE_URL}/${id}`);
}

/**
 * 更新产品推荐状态
 * @param data 产品信息
 */
export function updateProductRecommend(
  data: SiteProductAPI.ProductUpdateRecommend,
) {
  return requestClient.put(`${PRODUCT_BASE_URL}/recommend`, data);
}

/**
 * 更新产品状态
 * @param data 产品信息
 */
export function updateProductState(data: SiteProductAPI.ProductUpdateState) {
  return requestClient.put(`${PRODUCT_BASE_URL}/state`, data);
}
