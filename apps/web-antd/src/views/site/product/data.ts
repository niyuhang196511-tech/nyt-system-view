import type { SupportedLanguagesType } from '@vben/locales';
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { getProductCategoryAll } from '#/api/site/productCategory';
import { getRangePickerDefaultProps } from '#/utils';
import { productCategoryListToVOList } from '#/views/site/productCategory/utils';

/**
 * 获取产品全部分类
 */
const getProductCategories = async () => {
  const categories = await getProductCategoryAll();
  return productCategoryListToVOList(categories);
};

/**
 * 列表搜索表单
 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'categoryId',
      component: 'ApiSelect',
      label: '产品分类',
      componentProps: {
        api: () => getProductCategories(),
        labelField: 'name',
        valueField: 'id',
        clearable: true,
        filterable: true,
        placeholder: '请选择产品分类',
      },
    },
    {
      fieldName: 'name',
      component: 'Input',
      label: '产品名称',
      componentProps: {
        clearable: true,
        placeholder: '请输入产品名称',
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allClear: true,
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
      title: '产品编号',
      minWidth: 100,
    },
    {
      field: 'name',
      title: '产品名称',
      minWidth: 200,
    },
    {
      field: 'recommend',
      title: '置顶状态',
      minWidth: 150,
      slots: { default: 'recommend' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function useModalFormSchema(): VbenFormSchema[] {
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
      fieldName: 'categoryId',
      component: 'ApiSelect',
      label: '产品分类',
      rules: 'required',
      componentProps: {
        api: () => getProductCategories(),
        labelField: 'name',
        valueField: 'id',
        clearable: true,
        filterable: true,
        placeholder: '请选择产品分类',
      },
    },
    {
      fieldName: 'sort',
      component: 'InputNumber',
      label: '排序',
      rules: 'required',
      help: '排序用于展示的顺序，数值越小越靠前',
      componentProps: {
        placeholder: '请输入排序',
      },
    },
    {
      fieldName: 'recommend',
      component: 'Switch',
      label: '推荐',
      rules: 'required',
      help: '推荐的产品',
      componentProps: {
        class: 'w-auto',
      },
    },
  ];
}

/**
 * 模态框表单
 * @param lang
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
      label: '产品名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分类名称',
      },
    },
    {
      fieldName: 'description',
      label: '产品描述',
      rules: 'required',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入分类描述',
      },
    },
    {
      fieldName: 'cover',
      label: '封面图片',
      rules: 'required',
      component: 'ImageUpload',
      componentProps: {
        maxNumber: 1,
      },
    },
    {
      fieldName: 'heroVideo',
      label: '首屏视频',
      rules: 'required',
      component: 'FileUpload',
      componentProps: {
        maxNumber: 1,
        maxSize: 10,
        accept: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'rmvb', 'mkv', 'webm'],
      },
    },
    {
      fieldName: 'colorPage',
      label: '彩页',
      rules: 'required',
      component: 'ImageUpload',
      componentProps: {
        maxNumber: 1,
      },
    },
    {
      fieldName: 'images',
      label: '图片集',
      rules: 'required',
      component: 'ImageUpload',
      componentProps: {
        maxNumber: 10,
        multiple: true,
      },
    },
  ];
}

/**
 * 语言视频列表字段
 */
export function useLangVideoGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'title',
      title: '视频标题',
      minWidth: 120,
      slots: { default: 'title' },
    },
    {
      field: 'address',
      title: '视频地址',
      minWidth: 120,
      slots: { default: 'address' },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/**
 * 语言特点列表字段
 */
export function useLangCharacteristicGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '特点',
      minWidth: 120,
      slots: { default: 'name' },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
