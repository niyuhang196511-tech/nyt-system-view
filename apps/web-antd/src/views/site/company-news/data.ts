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
      fieldName: 'title',
      label: '新闻标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入新闻标题',
        allowClear: true,
      },
    },
    {
      fieldName: 'author',
      label: '作者',
      component: 'Input',
      componentProps: {
        placeholder: '请输入作者',
        allowClear: true,
      },
    },
    {
      fieldName: 'publish',
      label: '发布状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SITE_NEWS_PUBLISH, 'number'),
        placeholder: '请选择发布状态',
        allowClear: true,
      },
    },
    {
      fieldName: 'top',
      label: '置顶状态',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SITE_NEWS_TOP, 'number'),
        placeholder: '请选择置顶状态',
        allowClear: true,
      },
    },
    {
      fieldName: 'dates',
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
      title: '新闻编号',
      minWidth: 100,
    },
    {
      field: 'lang',
      title: '语言',
      minWidth: 200,
    },
    {
      field: 'title',
      title: '新闻标题',
      minWidth: 200,
      showFooterOverflow: true,
    },
    {
      field: 'subtitle',
      title: '新闻副标题',
      minWidth: 200,
      showFooterOverflow: true,
    },
    {
      field: 'author',
      title: '作者',
      minWidth: 150,
    },
    {
      field: 'publish',
      title: '发布状态',
      minWidth: 150,
      slots: { default: 'publish' },
    },
    {
      field: 'top',
      title: '置顶状态',
      minWidth: 150,
      slots: { default: 'topStatus' },
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      slots: { default: 'actions' },
    },
  ];
}

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
      fieldName: 'lang',
      component: 'Select',
      label: '语言',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SITE_LANGUAGE, 'string'),
        placeholder: '请选择语言',
        allowClear: true,
      },
    },
    {
      fieldName: 'title',
      component: 'Input',
      label: '新闻标题',
      componentProps: {
        placeholder: '请输入新闻标题',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'subtitle',
      component: 'Input',
      label: '副标题',
      componentProps: {
        placeholder: '请输入副标题',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'date',
      component: 'DatePicker',
      label: '发布日期',
      componentProps: {
        placeholder: '请选择发布日期',
        allowClear: true,
        showTime: true,
        // 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 dayjs，支持自定义格式
        format: 'YYYY-MM-DD HH:mm:ss',
        // 绑定值的格式，对 value、defaultValue、defaultPickerValue 起作用。不指定则绑定值为 dayjs 对象
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'author',
      component: 'Input',
      label: '作者',
      componentProps: {
        placeholder: '请输入作者',
        allowClear: true,
      },
    },
    {
      fieldName: 'cover',
      component: 'ImageUpload',
      label: '封面图片',
      componentProps: {
        placeholder: '请上传封面图片',
        maxCount: 1,
      },
      rules: 'required',
    },
    {
      fieldName: 'contentHtml',
      component: 'RichTextarea',
      label: '新闻内容',
      componentProps: {
        style: { width: '100%' },
      },
      rules: 'required',
    },
  ];
}
