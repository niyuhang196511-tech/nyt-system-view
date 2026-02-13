<script setup lang="ts">
import type { SupportedLanguagesType } from '@vben/locales';

import type { SiteProduct } from '#/api/site/product';

import { useTemplateRef } from 'vue';

import { useVbenForm } from '#/adapter/form';

import { useLangFormSchema } from '../data';
import Characteristic from './characteristic.vue';
import Video from './video.vue';

interface Props {
  lang: SupportedLanguagesType;
}

const props = defineProps<Props>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useLangFormSchema(props.lang),
  showDefaultActions: false,
});

const videoInstance =
  useTemplateRef<InstanceType<typeof Video>>('videoInstance');
const characteristicInstance = useTemplateRef<
  InstanceType<typeof Characteristic>
>('characteristicInstance');

/**
 * 暴露出表单校验方法和表单值获取方法
 */
defineExpose({
  validate: async () => {
    const { valid } = await formApi.validate();
    if (!valid) return valid;
    const videoValid = await videoInstance.value?.validate();
    if (!videoValid) return videoValid;
    const characteristicValid = await characteristicInstance.value?.validate();
    if (!characteristicValid) return characteristicValid;
    return true;
  },
  getValues: async () => {
    const data = (await formApi.getValues()) as SiteProduct.ProductLang;
    const videos = videoInstance.value!.getData();
    const characteristics = characteristicInstance.value!.getData();
    data.videos = videos;
    data.characteristics = characteristics;
    return data;
  },
  setValues: async (data: SiteProduct.ProductLang) => {
    await formApi.setValues(data);
    await videoInstance.value?.setData(data.videos || []);
    await characteristicInstance.value?.setData(data.characteristics || []);
  },
});
</script>

<template>
  <div>
    <Form class="mx-4" />

    <Video ref="videoInstance" />

    <Characteristic ref="characteristicInstance" />
  </div>
</template>
