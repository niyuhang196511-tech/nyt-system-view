<script setup lang="ts">
import type { SupportedLanguagesType } from '@vben/locales';

import { useVbenForm } from '#/adapter/form';

import { useLangFormSchema } from '../data';

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

/**
 * 暴露出表单校验方法和表单值获取方法
 */
defineExpose({
  validate: async () => {
    const { valid } = await formApi.validate();
    return valid;
  },
  getValues: formApi.getValues,
  setValues: formApi.setValues,
});
</script>

<template>
  <Form class="mx-4" />
</template>
