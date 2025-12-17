<script setup lang="ts">
import type { SupportedLanguagesType } from '@vben/locales';

import type { SiteProductCategoryAPI } from '#/api/site/productCategory';

import { computed, ref, useTemplateRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Tabs } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createProductCategory,
  getProductCategory,
  updateProductCategory,
} from '#/api/site/productCategory';
import { $t } from '#/locales';

import { useModelFormSchema } from '../data';
import LangForm from './lang-form.vue';

interface Emit {
  (e: 'success'): void;
}

const emit = defineEmits<Emit>();

const tabsName = ref<SupportedLanguagesType>('zh-CN');

type LangFormInstance = InstanceType<typeof LangForm>;
const zhCNFormRef = useTemplateRef<LangFormInstance>('zhCNFormRef');
const enUSFormRef = useTemplateRef<LangFormInstance>('enUSFormRef');

const formData = ref<SiteProductCategoryAPI.ProductCategory>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['产品分类'])
    : $t('ui.actionTitle.create', ['产品分类']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-san-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useModelFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    // 主表单校验
    const { valid } = await formApi.validate();
    if (!valid) return;

    // zhCN表单校验
    const zhCNValid = await zhCNFormRef.value?.validate();
    if (!zhCNValid) {
      tabsName.value = 'zh-CN';
      return;
    }

    // enUS表单校验
    const enUSValid = await enUSFormRef.value?.validate();
    if (!enUSValid) {
      tabsName.value = 'en-US';
      return;
    }

    modalApi.lock();

    // 主表数据
    const data =
      (await formApi.getValues()) as SiteProductCategoryAPI.ProductCategory;

    if (!data.langs) data.langs = [];
    // 子表数据
    data.langs[0] =
      (await zhCNFormRef.value?.getValues()) as SiteProductCategoryAPI.ProductCategoryLang;
    data.langs[1] =
      (await enUSFormRef.value?.getValues()) as SiteProductCategoryAPI.ProductCategoryLang;

    try {
      await (formData.value?.id
        ? updateProductCategory(data)
        : createProductCategory(data));

      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    let data = modalApi.getData<SiteProductCategoryAPI.ProductCategory>();
    if (!data) return;
    if (data.id) {
      modalApi.lock();
      try {
        data = await getProductCategory(data.id);
      } finally {
        modalApi.unlock();
      }
    }
    formData.value = data;

    await formApi.setValues(data);

    if (data.langs) {
      const zhCNLang = data.langs.find((lang) => lang.lang === 'zh-CN');
      if (zhCNLang) {
        await zhCNFormRef.value?.setValues(zhCNLang);
      }
      const enUSLang = data.langs.find((lang) => lang.lang === 'en-US');
      if (enUSLang) {
        await enUSFormRef.value?.setValues(enUSLang);
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
    <Tabs v-model:active-key="tabsName" animated centered>
      <Tabs.TabPane key="zh-CN" tab="中文" force-render>
        <LangForm lang="zh-CN" ref="zhCNFormRef" />
      </Tabs.TabPane>
      <Tabs.TabPane key="en-US" tab="English" force-render>
        <LangForm lang="en-US" ref="enUSFormRef" />
      </Tabs.TabPane>
    </Tabs>
  </Modal>
</template>

<style scoped></style>
