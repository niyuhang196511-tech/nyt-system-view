import type { SiteProductCategoryAPI } from '#/api/site/productCategory';

export function productCategoryListToVOList(
  list: Array<SiteProductCategoryAPI.ProductCategory>,
): Array<SiteProductCategoryAPI.ProductCategoryVO> {
  return list.map((c) => {
    const cVO: SiteProductCategoryAPI.ProductCategoryVO = {
      ...c,
    };
    const names: string[] = [];
    if (cVO.langs) {
      const zhCN = c.langs.find((l) => l.lang === 'zh-CN');
      const enUS = c.langs.find((l) => l.lang === 'en-US');
      zhCN && names.push(zhCN.name);
      enUS && names.push(enUS.name);
    }
    cVO.name = names.join(' / ');
    return cVO;
  });
}
