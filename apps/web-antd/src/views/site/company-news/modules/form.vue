<script setup lang="ts">
import type { SiteCompanyNews } from '#/api/site/company-news';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createCompanyNews,
  getCompanyNews,
  updateCompanyNews,
} from '#/api/site/company-news';

import { useModelFormSchema } from '../data';

interface IEmit {
  (e: 'success'): void;
}

const emit = defineEmits<IEmit>();

const formData = ref<SiteCompanyNews.CompanyNews>();

const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['公司新闻资讯'])
    : $t('ui.actionTitle.create', ['公司新闻资讯']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useModelFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    // 表单校验
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();

    // 表单数据
    const data = (await formApi.getValues()) as SiteCompanyNews.CompanyNews;

    if (data.date) {
      data.date = dayjs(data.date).valueOf();
    }

    try {
      await (formData.value?.id
        ? updateCompanyNews(data)
        : createCompanyNews(data));

      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }

    let data = modalApi.getData<SiteCompanyNews.CompanyNews>();
    if (!data) return;
    if (data.id) {
      modalApi.lock();
      try {
        data = await getCompanyNews(data.id);
      } finally {
        modalApi.unlock();
      }
    }

    if (data.date) {
      data.date = dayjs(data.date).format('YYYY-MM-DD HH:mm:ss');
    }

    formData.value = data;

    await formApi.setValues(data);
  },
});
</script>
<template>
  <Modal :title="getTitle" class="w-1/3">
    <Form class="mx-4" />
  </Modal>
</template>
