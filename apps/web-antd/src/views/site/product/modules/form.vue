<script setup lang="ts">
import type { SiteProductAPI } from '#/api/site/product';

import { computed, ref, useTemplateRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Tabs } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createProduct, getProduct, updateProduct } from '#/api/site/product';

import { useModalFormSchema } from '../data';
import Lang from './lang.vue';

interface Emit {
  (e: 'success'): void;
}

const emit = defineEmits<Emit>();

type LangInstance = InstanceType<typeof Lang>;
const zhCNLangInstance = useTemplateRef<LangInstance>('zhCNLangInstance');
const enUSLangInstance = useTemplateRef<LangInstance>('enUSLangInstance');

const formData = ref<SiteProductAPI.Product>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useModalFormSchema(),
  showDefaultActions: false,
});

const tabsName = ref('zh-CN');

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['产品'])
    : $t('ui.actionTitle.create', ['产品']);
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    // 主表单校验
    const { valid } = await formApi.validate();
    if (!valid) return;

    // zhCN表单校验
    const zhCNValid = await zhCNLangInstance.value?.validate();
    if (!zhCNValid) {
      tabsName.value = 'zh-CN';
      return;
    }

    // enUS表单校验
    const enUSValid = await enUSLangInstance.value?.validate();
    if (!enUSValid) {
      tabsName.value = 'en-US';
      return;
    }

    // 主表数据
    const data = (await formApi.getValues()) as SiteProductAPI.Product;

    if (!data.langs) data.langs = [];

    // 子数据
    data.langs[0] =
      (await zhCNLangInstance.value?.getValues()) as SiteProductAPI.ProductLang;
    data.langs[1] =
      (await enUSLangInstance.value?.getValues()) as SiteProductAPI.ProductLang;

    modalApi.lock();

    try {
      await (formData.value?.id ? updateProduct(data) : createProduct(data));

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
    let data = modalApi.getData<SiteProductAPI.Product>();
    if (!data) return;
    if (data.id) {
      modalApi.lock();
      try {
        data = await getProduct(data.id);
      } finally {
        modalApi.unlock();
      }
    }

    formData.value = data;

    await formApi.setValues(data);

    if (data.langs) {
      const zhCNLang = data.langs.find((lang) => lang.lang === 'zh-CN');
      if (zhCNLang) await zhCNLangInstance.value.setValues(zhCNLang);

      const enUSLang = data.langs.find((lang) => lang.lang === 'en-US');
      if (enUSLang) await enUSLangInstance.value.setValues(enUSLang);
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-1/3">
    <Form class="mx-4" />

    <Tabs v-model:active-key="tabsName" animated centered>
      <Tabs.TabPane key="zh-CN" tab="中文" force-render>
        <Lang lang="zh-CN" ref="zhCNLangInstance" />
      </Tabs.TabPane>
      <Tabs.TabPane key="en-US" tab="English" force-render>
        <Lang lang="en-US" ref="enUSLangInstance" />
      </Tabs.TabPane>
    </Tabs>
  </Modal>
</template>
