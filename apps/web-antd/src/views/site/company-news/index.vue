<script setup lang="ts">
import type { ActionItem, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SiteCompanyNews } from '#/api/site/company-news';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Switch } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteCompanyNews,
  getCompanyNewsList,
  updateCompanyNewsPublish,
  updateCompanyNewsTop,
} from '#/api/site/company-news';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
  draggable: true,
  fullscreen: true,
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
          return await getCompanyNewsList({
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
  } as VxeTableGridOptions<SiteCompanyNews.CompanyNews>,
});

/**
 * 刷新表格数据
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
async function handleEdit(row: SiteCompanyNews.CompanyNews) {
  formModalApi.setData(row).open();
}

/**
 * 删除新闻资讯
 * @param row 新闻资讯信息
 */
async function handleDelete(row: SiteCompanyNews.CompanyNews) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteCompanyNews(row.id!);
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
async function handlePublishChange(
  row: SiteCompanyNews.CompanyNews,
  state: SiteCompanyNews.NewsPublish,
) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.updating', [row.id]),
    duration: 0,
  });
  try {
    await updateCompanyNewsPublish({ id: row.id!, publish: state });
    message.success($t('ui.actionMessage.updateSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/**
 * 置顶状态变更
 * @param row 新闻资讯信息
 * @param state 置顶状态
 */
async function handleTopChange(
  row: SiteCompanyNews.CompanyNews,
  state: SiteCompanyNews.NewsTop,
) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.updating', [row.id]),
    duration: 0,
  });
  try {
    await updateCompanyNewsTop({ id: row.id!, top: state });
    message.success($t('ui.actionMessage.updateSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/**
 * toolbar动作
 */
const toolbarActions: ActionItem[] = [
  {
    label: $t('ui.actionTitle.create', ['新闻资讯']),
    type: 'primary',
    icon: ACTION_ICON.ADD,
    auth: ['site:company-news:create'],
    onClick: handleCreate,
  },
];

/**
 * 获取table动作
 * @param row
 */
function getTableAction(row: SiteCompanyNews.CompanyNews): ActionItem[] {
  return [
    {
      label: $t('common.edit'),
      type: 'link',
      icon: ACTION_ICON.EDIT,
      auth: ['site:company-news:query', 'site:company-news:update'],
      onClick: handleEdit.bind(null, row),
    },
    {
      label: $t('common.delete'),
      type: 'link',
      danger: true,
      icon: ACTION_ICON.DELETE,
      auth: ['site:company-news:delete'],
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

    <Grid table-title="公司新闻资讯列表">
      <template #toolbar-tools>
        <TableAction :actions="toolbarActions" />
      </template>

      <template #actions="{ row }">
        <TableAction :actions="getTableAction(row)" />
      </template>

      <template #publish="{ row }">
        <Switch
          v-model:checked="row.publish"
          :checked-value="1"
          :un-checked-value="0"
          @change="
            (state) =>
              handlePublishChange(row, state as SiteCompanyNews.NewsPublish)
          "
        />
      </template>

      <template #topStatus="{ row }">
        <Switch
          v-model:checked="row.top"
          :checked-value="1"
          :un-checked-value="0"
          @change="
            (state) => handleTopChange(row, state as SiteCompanyNews.NewsTop)
          "
        />
      </template>
    </Grid>
  </Page>
</template>
