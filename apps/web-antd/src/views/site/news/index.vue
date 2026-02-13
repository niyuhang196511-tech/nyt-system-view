<script setup lang="ts">
import type { ActionItem, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SiteNews } from '#/api/site/news';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Switch, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteNews,
  getNewsList,
  updateNewsPublish,
  updateNewsTop,
} from '#/api/site/news';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

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
        query: async ({ page }, formValues) => {
          return await getNewsList({
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
  } as VxeTableGridOptions<SiteNews.NewsVO>,
});

/**
 * 刷新表格
 */
function handleRefresh() {
  gridApi.query();
}

/**
 * 创建新闻资讯
 */
async function handleCreate() {
  formModalApi.setData(null).open();
}

/**
 * 修改新闻资讯
 * @param row 新闻资讯信息
 */
async function handleEdit(row: SiteNews.NewsVO) {
  formModalApi.setData(row).open();
}

/**
 * 删除新闻资讯
 * @param row 新闻资讯信息
 */
async function handleDelete(row: SiteNews.NewsVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteNews(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/**
 * 发布状态变更
 * @param row 新闻资讯信息
 * @param state 发布状态
 */
async function handlePublishChange(row: SiteNews.News, state: boolean) {
  await updateNewsPublish({ id: row.id!, publish: state });
  handleRefresh();
}

/**
 * 置顶状态变更
 * @param row 新闻资讯信息
 * @param state 置顶状态
 */
async function handleTopChange(row: SiteNews.News, state: boolean) {
  await updateNewsTop({ id: row.id!, top: state });
  handleRefresh();
}

/**
 * toolbar动作
 */
const toolbarActions: ActionItem[] = [
  {
    label: $t('ui.actionTitle.create', ['新闻资讯']),
    type: 'primary',
    icon: ACTION_ICON.ADD,
    onClick: handleCreate,
  },
];

/**
 * 获取table动作
 * @param row
 */
function getTableAction(row: SiteNews.NewsVO): ActionItem[] {
  return [
    {
      label: $t('common.edit'),
      type: 'link',
      icon: ACTION_ICON.EDIT,
      onClick: handleEdit.bind(null, row),
    },
    {
      label: $t('common.delete'),
      type: 'link',
      danger: true,
      icon: ACTION_ICON.DELETE,
      popConfirm: {
        title: $t('ui.actionMessage.deleteConfirm', [row.id]),
        confirm: handleDelete.bind(null, row),
      },
    },
  ];
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="handleRefresh" />

    <Grid table-title="新闻资讯列表">
      <template #toolbar-tools>
        <TableAction :actions="toolbarActions" />
      </template>
      <template #actions="{ row }">
        <TableAction :actions="getTableAction(row)" />
      </template>

      <template #publish="{ row }">
        <Switch
          v-model:checked="row.publish"
          @change="(state: boolean) => handlePublishChange(row, state)"
        />
      </template>

      <template #topStatus="{ row }">
        <Switch
          v-model:checked="row.top"
          @change="(state: boolean) => handleTopChange(row, state)"
        />
      </template>

      <template #tags="{ row }">
        <template v-for="tag in row.tags" :key="tag.id">
          <Tag color="processing">{{ tag.name }}</Tag>
        </template>
      </template>
    </Grid>
  </Page>
</template>
