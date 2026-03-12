<script setup lang="ts">
import type { ActionItem } from '#/adapter/vxe-table';
import type { SiteProductAPI } from '#/api/site/product';

import { IconifyIcon } from '@vben/icons';

import { Button, Input } from 'ant-design-vue';

import { ACTION_ICON, useVbenVxeGrid } from '#/adapter/vxe-table';
import { TableAction } from '#/components/table-action';
import { FileUpload } from '#/components/upload';
import { $t } from '#/locales';
import { useLangVideoGridColumns } from '#/views/site/product/data';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useLangVideoGridColumns(),
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
      title: [{ required: true, message: '视频标题不能为空' }],
      address: [{ required: true, message: '视频地址不能为空' }],
    },
  },
});

/** 添加产品视频 */
async function handleAdd() {
  await gridApi.grid.insertAt({} as SiteProductAPI.Video, -1);
}

/** 删除产品视频 */
async function handleDelete(row: SiteProductAPI.Video) {
  await gridApi.grid.remove(row);
}

function getActions(row: SiteProductAPI.Video): ActionItem[] {
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
  getData: (): SiteProductAPI.Video[] => {
    const data = gridApi.grid.getData() as SiteProductAPI.Video[];
    const removeRecords =
      gridApi.grid.getRemoveRecords() as SiteProductAPI.Video[];
    const insertRecords =
      gridApi.grid.getInsertRecords() as SiteProductAPI.Video[];
    return [
      ...data.filter(
        (row) => !removeRecords.some((removed) => removed.id === row.id),
      ),
      ...insertRecords.map((row: any) => ({ ...row, id: undefined })),
    ];
  },
  setData: async (data: SiteProductAPI.Video[]) => {
    await gridApi.grid.loadData(data);
  },
});
</script>

<template>
  <div class="mx-6 my-4">
    <Button type="primary" ghost @click="handleAdd">
      <IconifyIcon icon="lucide:plus" />
      {{ $t('ui.actionTitle.create', ['产品视频']) }}
    </Button>
  </div>
  <Grid class="mx-4">
    <template #title="{ row }">
      <Input v-model:value="row.title" />
    </template>
    <template #address="{ row }">
      <FileUpload v-model:value="row.address" :max-size="100" />
    </template>
    <template #actions="{ row }">
      <TableAction :actions="getActions(row)" />
    </template>
  </Grid>
</template>
