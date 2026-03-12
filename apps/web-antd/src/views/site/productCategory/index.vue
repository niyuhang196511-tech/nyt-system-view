<script setup lang="ts">
import type { ActionItem, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SiteProductCategoryAPI } from '#/api/site/productCategory';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Switch } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProductCategory,
  getProductCategoryList,
  updateProductCategoryState,
} from '#/api/site/productCategory';
import { productCategoryListToVOList } from '#/views/site/productCategory/utils';

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
          const data = await getProductCategoryList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });

          data.list = productCategoryListToVOList(data.list);

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
  } as VxeTableGridOptions<SiteProductCategoryAPI.ProductCategory>,
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
async function handleEdit(row: SiteProductCategoryAPI.ProductCategory) {
  formModalApi.setData(row).open();
}

async function handleDelete(row: SiteProductCategoryAPI.ProductCategory) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
  });
  try {
    await deleteProductCategory(row.id!);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    handleRefresh();
  } finally {
    hideLoading();
  }
}

/**
 * 更新产品分类状态
 * @param row
 * @param state
 */
async function handleStateChange(
  row: SiteProductCategoryAPI.ProductCategory,
  state: SiteProductCategoryAPI.OperatingState,
) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.updating', [row.id]),
    duration: 0,
  });
  try {
    await updateProductCategoryState(row.id!, state);
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
    auth: ['site:product-category:create'],
    onClick: handleCreate,
  },
];

/**
 * 获取table动作
 * @param row
 */
function getTableAction(
  row: SiteProductCategoryAPI.ProductCategory,
): ActionItem[] {
  return [
    {
      label: $t('common.edit'),
      type: 'link',
      icon: ACTION_ICON.EDIT,
      auth: ['site:product-category:query', 'site:product-category:update'],
      onClick: handleEdit.bind(null, row),
    },
    {
      label: $t('common.delete'),
      type: 'link',
      danger: true,
      icon: ACTION_ICON.DELETE,
      auth: ['site:product-category:delete'],
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

    <Grid table-title="产品分类列表">
      <template #toolbar-tools>
        <TableAction :actions="toolbarActions" />
      </template>
      <template #actions="{ row }">
        <TableAction :actions="getTableAction(row)" />
      </template>

      <template #state="{ row }">
        <Switch
          v-access:code="['site:product-category:update']"
          v-model:checked="row.state"
          :checked-value="0"
          :un-checked-value="1"
          @change="
            (state) =>
              handleStateChange(
                row,
                state as SiteProductCategoryAPI.OperatingState,
              )
          "
        />
      </template>
    </Grid>
  </Page>
</template>
