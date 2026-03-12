<script setup lang="ts">
import type { ActionItem, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SiteNewsCategoryAPI } from '#/api/site/newsCategory';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Switch } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteNewsCategory,
  getNewsCategoryList,
  updateNewsCategoryState,
} from '#/api/site/newsCategory';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';
import { newsCategoryListToVOList } from './utils';

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
          const data = await getNewsCategoryList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });

          data.list = newsCategoryListToVOList(data.list);

          return data;
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
  } as VxeTableGridOptions<SiteNewsCategoryAPI.NewsCategory>,
});

/**
 * 刷新表格
 */
function handleRefresh() {
  gridApi.query();
}

/**
 * 创建产品分类
 */
async function handleCreate() {
  formModalApi.setData(null).open();
}

/**
 * 修改产品分类
 * @param row 产品分类信息
 */
async function handleEdit(row: SiteNewsCategoryAPI.NewsCategory) {
  formModalApi.setData(row).open();
}

async function handleDelete(row: SiteNewsCategoryAPI.NewsCategory) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteNewsCategory(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/**
 * 修改分类状态
 * @param row
 * @param state
 */
async function handleStateChange(
  row: SiteNewsCategoryAPI.NewsCategory,
  state: SiteNewsCategoryAPI.OperatingState,
) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.updating', [row.id]),
    duration: 0,
  });
  try {
    await updateNewsCategoryState({ id: row.id!, state });
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
    label: $t('ui.actionTitle.create', ['产品分类']),
    type: 'primary',
    icon: ACTION_ICON.ADD,
    auth: ['site:news-category:create'],
    onClick: handleCreate,
  },
];

/**
 * 获取table动作
 * @param row
 */
function getTableAction(row: SiteNewsCategoryAPI.NewsCategory): ActionItem[] {
  return [
    {
      label: $t('common.edit'),
      type: 'link',
      icon: ACTION_ICON.EDIT,
      auth: ['site:news-category:query', 'site:news-category:update'],
      onClick: handleEdit.bind(null, row),
    },
    {
      label: $t('common.delete'),
      type: 'link',
      danger: true,
      icon: ACTION_ICON.DELETE,
      auth: ['site:news-category:delete'],
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

    <Grid table-title="新闻资讯分类列表">
      <template #toolbar-tools>
        <TableAction :actions="toolbarActions" />
      </template>
      <template #actions="{ row }">
        <TableAction :actions="getTableAction(row)" />
      </template>

      <template #state="{ row }">
        <Switch
          v-model:checked="row.state"
          :checked-value="0"
          :un-checked-value="1"
          @change="
            (state) =>
              handleStateChange(
                row,
                state as SiteNewsCategoryAPI.OperatingState,
              )
          "
        />
      </template>
    </Grid>
  </Page>
</template>
