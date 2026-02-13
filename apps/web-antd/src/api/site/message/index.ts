import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace SiteMessage {
  export interface Message {
    id: number;
    name: string;
    company: string;
    phone: string;
    email: string;
    message: string;
    dispose: boolean;
  }
}

const MESSAGE_BASE_URL = 'site/message';

/**
 * 查询站点留言列表
 * @param params
 */
export function getMessageList(params: PageParam) {
  return requestClient.get<PageResult<SiteMessage.Message>>(
    `${MESSAGE_BASE_URL}/list`,
    {
      params,
    },
  );
}

/**
 * 处理站点留言
 * @param id
 */
export function disposeMessage(id: number) {
  return requestClient.put(`${MESSAGE_BASE_URL}/dispose/${id}`);
}
