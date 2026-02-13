import type { SiteNewsCategoryAPI } from '#/api/site/newsCategory';

export function newsCategoryListToVOList(
  list: Array<SiteNewsCategoryAPI.NewsCategory>,
): Array<SiteNewsCategoryAPI.NewsCategory> {
  return list.map((c) => {
    const cVO: SiteNewsCategoryAPI.NewsCategory = {
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
