<script setup lang="ts">
import type { ActionItem, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SiteMessage } from '#/api/site/message';

import { Page } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { disposeMessage, getMessageList } from '#/api/site/message';

import { useGridColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }: any, formValues: any) => {
          return await getMessageList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<SiteMessage.Message>,
});

/**
 * 刷新表格
 */
function handleRefresh() {
  gridApi.query();
}

/**
 * 删除新闻资讯
 * @param row 新闻资讯信息
 */
// async function handleDelete(row: SiteNews.NewsVO) {
//   const hideLoading = message.loading({
//     content: $t('ui.actionMessage.deleting', [row.id]),
//     duration: 0,
//   });
//   try {
//     await deleteNews(row.id!);
//     message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
//     handleRefresh();
//   } finally {
//     hideLoading();
//   }
// }

/**
 * 发布状态变更
 * @param row 新闻资讯信息
 * @param state 发布状态
 */
async function handleDisposeMessage(row: SiteMessage.Message) {
  await disposeMessage(row.id!);
  handleRefresh();
}

/**
 * 获取table动作
 * @param row
 */
function getTableAction(row: SiteMessage.Message): ActionItem[] {
  const actions: ActionItem[] = [];

  if (!row.dispose) {
    actions.push({
      label: '处理留言',
      type: 'link',
      icon: ACTION_ICON.EDIT,
      onClick: () => {
        handleDisposeMessage.bind(null, row);
      },
    });
  }
  return actions;
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="留言列表">
      <template #actions="{ row }">
        <TableAction :actions="getTableAction(row)" />
      </template>

      <template #dispose="{ row }">
        <Tag :color="row.dispose ? 'success' : 'error'">
          {{ row.dispose ? '已处理' : '未处理' }}
        </Tag>
      </template>
    </Grid>
  </Page>
</template>
