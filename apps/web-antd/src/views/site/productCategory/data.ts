import type { SupportedLanguagesType } from '@vben/locales';
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';

/**
 * 列表搜索表单
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
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
      title: '分类编号',
      minWidth: 100,
    },
    {
      field: 'name',
      title: '分类名称',
      minWidth: 200,
    },
    {
      field: 'state',
      title: '启用状态',
      minWidth: 150,
      slots: { default: 'state' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/**
 * 弹框表单
 */
export function useModelFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'sort',
      label: '排序',
      component: 'InputNumber',
      rules: 'required',
      help: '排序用于展示的顺序，数值越小越靠前',
      componentProps: {
        placeholder: '请输入排序',
      },
    },
    {
      fieldName: 'state',
      label: '状态',
      component: 'RadioGroup',
      help: '状态用于控制分类的启用或禁用',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SITE_OPERATION_STATE, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: 0,
      rules: 'required',
    },
  ];
}

/**
 * 语言表单
 */
export function useLangFormSchema(
  lang: SupportedLanguagesType,
): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'lang',
      label: '语言类型',
      rules: 'required',
      component: 'Input',
      disabled: true,
      defaultValue: lang,
      componentProps: {
        placeholder: '请选择语言类型',
      },
    },
    {
      fieldName: 'name',
      label: '分类名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分类名称',
      },
    },
    {
      fieldName: 'description',
      label: '分类描述',
      rules: 'required',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入分类描述',
      },
    },
  ];
}
