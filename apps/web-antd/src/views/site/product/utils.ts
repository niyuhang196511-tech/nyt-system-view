import type { SiteProductAPI } from '#/api/site/product';

/**
 * 产品列表转换为VO列表
 * @param list
 */
export function productListToVOList(
  list: Array<SiteProductAPI.Product>,
): Array<SiteProductAPI.ProductVO> {
  return list.map((product) => {
    const productVO: SiteProductAPI.ProductVO = {
      ...product,
    };

    const names: string[] = [];

    if (productVO.langs) {
      const zhCN = productVO.langs.find((l) => l.lang === 'zh-CN');
      const enUS = productVO.langs.find((l) => l.lang === 'en-US');
      zhCN && names.push(zhCN.name);
      enUS && names.push(enUS.name);
    }
    productVO.name = names.join(' / ');
    return productVO;
  });
}
