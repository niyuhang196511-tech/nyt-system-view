<script setup lang="ts">
import type { SiteNews } from '#/api/site/news';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createNews, getNews, updateNews } from '#/api/site/news';
import { $t } from '#/locales';

import { useModelFormSchema } from '../data';
import dayjs from 'dayjs';

interface Emit {
  (e: 'success'): void;
}

const emit = defineEmits<Emit>();

const formData = ref<SiteProductCategoryAPI.ProductCategory>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['新闻资讯'])
    : $t('ui.actionTitle.create', ['新闻资讯']);
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
    // 主表单校验
    const { valid } = await formApi.validate();
    if (!valid) return;

    modalApi.lock();

    // 主表数据
    const data = (await formApi.getValues()) as SiteNews.NewsDTO;

    // 将时间转换为时间戳
    if (data.date) {
      data.date = dayjs(data.date).valueOf();
    }

    try {
      await (formData.value?.id ? updateNews(data) : createNews(data));

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
    let data = modalApi.getData<SiteNews.NewsVO>();
    if (!data) return;
    if (data.id) {
      modalApi.lock();
      try {
        data = await getNews(data.id);
      } finally {
        modalApi.unlock();
      }
    }

    // 将时间戳转换为日期
    if (data.date) {
      data.date = dayjs(data.date).format('YYYY-MM-DD HH:mm:ss');
    }

    if (data.tags) {
      data.tags = data.tags.map((tag) => tag.name);
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
