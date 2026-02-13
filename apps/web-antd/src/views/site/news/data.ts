import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { getNewsCategoryAll } from '#/api/site/newsCategory';
import { getNewsTagAll } from '#/api/site/newsTag';
import { getRangePickerDefaultProps } from '#/utils';
import { newsCategoryListToVOList } from '#/views/site/newsCategory/utils';

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
        placeholder: '请选择发布状态',
        allowClear: true,
        options: [
          { label: '已发布', value: true },
          { label: '未发布', value: false },
        ],
      },
    },
    {
      fieldName: 'top',
      label: '置顶状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择置顶状态',
        allowClear: true,
        options: [
          { label: '已置顶', value: true },
          { label: '未置顶', value: false },
        ],
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
      showOverflow: true,
    },
    {
      field: 'subtitle',
      title: '副标题',
      minWidth: 200,
      showOverflow: true,
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
      field: 'tags',
      title: '标签',
      minWidth: 200,
      slots: { default: 'tags' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

async function getNewsCategories() {
  const categories = await getNewsCategoryAll();
  return newsCategoryListToVOList(categories);
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
        options: [
          { label: '中文', value: 'zh-CN' },
          { label: '英文', value: 'en-US' },
        ],
        placeholder: '请选择语言',
        allowClear: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'categoryId',
      component: 'ApiSelect',
      label: '新闻分类',
      componentProps: {
        api: getNewsCategories,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择新闻分类',
        allowClear: true,
        showSearch: true,
      },
      rules: 'required',
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
    {
      fieldName: 'tags',
      component: 'ApiSelect',
      label: '标签',
      componentProps: {
        api: getNewsTagAll,
        labelField: 'name',
        valueField: 'name',
        placeholder: '请选择标签',
        allowClear: true,
        showSearch: true,
        mode: 'multiple',
        allowCreate: true,
        createOption: (searchTerm: string) => {
          searchTerm = searchTerm.trim();
          if (searchTerm) {
            return { label: searchTerm, value: searchTerm };
          }
          return null;
        },
      },
      rules: 'required',
    },
  ];
}
