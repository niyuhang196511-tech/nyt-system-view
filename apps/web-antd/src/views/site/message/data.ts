import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { getRangePickerDefaultProps } from '#/utils';

/**
 * 列表搜索表单
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入姓名',
        allowClear: true,
      },
    },
    {
      fieldName: 'company',
      label: '公司名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入公司名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
        allowClear: true,
      },
    },
    {
      fieldName: 'phone',
      label: '电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电话',
        allowClear: true,
      },
    },
    {
      fieldName: 'dispose',
      label: '处理状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处理状态',
        allowClear: true,
        options: [
          { label: '已处理', value: true },
          { label: '未处理', value: false },
        ],
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/**
 * 列表字段
 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '留言编号',
      minWidth: 100,
    },
    {
      field: 'name',
      title: '姓名',
      minWidth: 200,
    },
    {
      field: 'company',
      title: '公司名称',
      minWidth: 200,
      showOverflow: true,
    },
    {
      field: 'phone',
      title: '电话',
      minWidth: 200,
      showOverflow: true,
    },
    {
      field: 'dispose',
      title: '处理状态',
      minWidth: 150,
      slots: { default: 'dispose' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
