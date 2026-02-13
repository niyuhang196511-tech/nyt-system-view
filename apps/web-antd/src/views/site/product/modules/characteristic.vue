<script setup lang="ts">
import type { ActionItem } from '#/adapter/vxe-table';
import type { SiteProduct } from '#/api/site/product';

import { IconifyIcon } from '@vben/icons';

import { Button, Input } from 'ant-design-vue';

import { ACTION_ICON, useVbenVxeGrid } from '#/adapter/vxe-table';
import { TableAction } from '#/components/table-action';
import { $t } from '#/locales';
import { useLangCharacteristicGridColumns } from '#/views/site/product/data';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useLangCharacteristicGridColumns(),
    border: true,
    showOverflow: true,
    autoResize: true,
    keepSource: true,
    rowConfig: {
      keyField: 'id',
    },
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    editRules: {
      name: [{ required: true, message: '特点必须填写' }],
    },
  },
});

/** 添加产品特点 */
async function handleAdd() {
  await gridApi.grid.insertAt({} as SiteProduct.Characteristic, -1);
}

/** 删除产品特点 */
async function handleDelete(row: SiteProduct.Characteristic) {
  await gridApi.grid.remove(row);
}

function getActions(row: SiteProduct.Characteristic): ActionItem[] {
  return [
    {
      label: $t('common.delete'),
      danger: true,
      type: 'link',
      icon: ACTION_ICON.DELETE,
      popConfirm: {
        title: $t('ui.actionMessage.deleteConfirm', [row.id]),
        confirm: handleDelete.bind(null, row),
      },
    },
  ];
}

defineExpose({
  validate: async () => {
    return !(await gridApi.grid.validate(true));
  },
  getData: (): SiteProduct.Characteristic[] => {
    const data = gridApi.grid.getData() as SiteProduct.Characteristic[];
    const removeRecords =
      gridApi.grid.getRemoveRecords() as SiteProduct.Characteristic[];
    const insertRecords =
      gridApi.grid.getInsertRecords() as SiteProduct.Characteristic[];
    return [
      ...data.filter(
        (row) => !removeRecords.some((removed) => removed.id === row.id),
      ),
      ...insertRecords.map((row: any) => ({ ...row, id: undefined })),
    ];
  },
  setData: (data: SiteProduct.Characteristic[]) => {
    return gridApi.grid.loadData(data);
  },
});
</script>

<template>
  <div class="mx-6 my-4">
    <Button type="primary" ghost @click="handleAdd">
      <IconifyIcon icon="lucide:plus" />
      {{ $t('ui.actionTitle.create', ['产品特点']) }}
    </Button>
  </div>
  <Grid class="mx-4">
    <template #name="{ row }">
      <Input v-model:value="row.name" />
    </template>
    <template #actions="{ row }">
      <TableAction :actions="getActions(row)" />
    </template>
  </Grid>
</template>

<style scoped></style>
