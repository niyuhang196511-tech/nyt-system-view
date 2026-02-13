<script lang="ts" setup>
import type { Component } from 'vue';

import type { AnyPromiseFunction } from '@vben/types';

import { computed, nextTick, ref, unref, useAttrs, watch } from 'vue';

import { LoaderCircle } from '@vben/icons';

import { cloneDeep, get, isEqual, isFunction } from '@vben-core/shared/utils';

import { objectOmit } from '@vueuse/core';

type OptionsItem = {
  [name: string]: any;
  children?: OptionsItem[];
  disabled?: boolean;
  label?: string;
  value?: any;
};

interface Props {
  component: Component;
  numberToString?: boolean;
  api?: (arg?: any) => Promise<OptionsItem[] | Record<string, any>>;
  params?: Record<string, any>;
  resultField?: string;
  labelField?: string;
  childrenField?: string;
  valueField?: string;
  optionsPropName?: string;
  immediate?: boolean;
  alwaysLoad?: boolean;
  // eslint-disable-next-line vue/require-default-prop
  beforeFetch?: AnyPromiseFunction<any, any>;
  // eslint-disable-next-line vue/require-default-prop
  afterFetch?: AnyPromiseFunction<any, any>;
  options?: OptionsItem[];
  loadingSlot?: string;
  visibleEvent?: string;
  modelPropName?: string;
  autoSelect?:
    | 'first'
    | 'last'
    | 'one'
    | ((item: OptionsItem[]) => OptionsItem)
    | false;
  allowCreate?: boolean;
  // eslint-disable-next-line vue/require-default-prop
  createOption?: (
    searchTerm: string,
    existingOptions: OptionsItem[],
  ) => null | OptionsItem | undefined;
  searchEvent?: string;
  multiple?: boolean;
}

defineOptions({ name: 'ApiComponent', inheritAttrs: false });

const props = withDefaults(defineProps<Props>(), {
  labelField: 'label',
  valueField: 'value',
  childrenField: '',
  optionsPropName: 'options',
  resultField: '',
  visibleEvent: '',
  numberToString: false,
  params: () => ({}),
  immediate: true,
  alwaysLoad: false,
  loadingSlot: '',
  modelPropName: 'modelValue',
  api: undefined,
  autoSelect: false,
  options: () => [],
  allowCreate: false,
  searchEvent: 'onSearch',
  multiple: false,
});

const emit = defineEmits<{
  createOption: [OptionsItem];
  optionsChange: [OptionsItem[]];
}>();

const modelValue = defineModel<any>({ default: undefined });

const attrs = useAttrs();
const componentRef = ref();

const innerParams = ref({});
const refOptions = ref<OptionsItem[]>([]);
const createdOptions = ref<OptionsItem[]>([]);
const searchTerm = ref('');

const loading = ref(false);
const isFirstLoaded = ref(false);
const hasPendingRequest = ref(false);

/* ---------------- 数据转换 ---------------- */

function transformData(data: OptionsItem[]): OptionsItem[] {
  const { labelField, valueField, childrenField, numberToString } = props;

  return data.map((item) => {
    const value = get(item, valueField);
    return {
      ...objectOmit(item, [labelField, valueField, childrenField]),
      label: get(item, labelField),
      value: numberToString ? `${value}` : value,
      ...(childrenField && item[childrenField]
        ? { children: transformData(item[childrenField]) }
        : {}),
    };
  });
}

/* ---------------- 纯 options（唯一数据源） ---------------- */

function getPureOptions(): OptionsItem[] {
  return [...createdOptions.value, ...transformData(refOptions.value)];
}

/* ---------------- 临时创建 option（仅展示） ---------------- */

function getTempCreateOption(): null | OptionsItem {
  if (!props.allowCreate || !props.createOption) return null;

  const term = searchTerm.value.trim();
  if (!term) return null;

  const option = props.createOption(term, getPureOptions());
  if (!option || option.value === undefined) return null;

  return option;
}

/* ---------------- 最终 options ---------------- */

const getOptions = computed<OptionsItem[]>(() => {
  const base = getPureOptions();
  const temp = getTempCreateOption();

  if (temp && !base.some((o) => o.value === temp.value)) {
    return [temp, ...base];
  }

  return base.length > 0 ? base : props.options;
});

/* ---------------- 搜索 ---------------- */

function handleSearch(value: string) {
  searchTerm.value = value;
}

/* ---------------- 保存新建 option（唯一入口） ---------------- */

function saveNewOption(value: any) {
  if (createdOptions.value.some((o) => o.value === value)) {
    return;
  }

  const temp = getTempCreateOption();
  if (temp && temp.value === value) {
    createdOptions.value.push(temp);
    emit('createOption', temp);
  }
}

/* ---------------- 值变更 ---------------- */

function handleValueChange(val: any) {
  modelValue.value = val;

  if (props.multiple && Array.isArray(val)) {
    val.forEach((element) => {
      saveNewOption(element);
    });
  } else {
    saveNewOption(val);
  }

  nextTick(() => {
    searchTerm.value = '';
  });
}

/* ---------------- 绑定 props ---------------- */

const bindProps = computed(() => {
  return {
    [props.modelPropName]: unref(modelValue),
    [props.optionsPropName]: unref(getOptions),
    [`onUpdate:${props.modelPropName}`]: handleValueChange,
    ...(props.allowCreate && props.searchEvent
      ? { [props.searchEvent]: handleSearch }
      : {}),
    ...objectOmit(attrs, [
      `onUpdate:${props.modelPropName}`,
      props.searchEvent,
    ]),
    ...(props.visibleEvent
      ? { [props.visibleEvent]: handleFetchForVisible }
      : {}),
  };
});

/* ---------------- API 请求 ---------------- */

const mergedParams = computed(() => ({
  ...props.params,
  ...unref(innerParams),
}));

async function fetchApi() {
  const { api, beforeFetch, afterFetch, resultField } = props;
  if (!api || !isFunction(api)) return;

  if (loading.value) {
    hasPendingRequest.value = true;
    return;
  }

  try {
    loading.value = true;

    let finalParams = cloneDeep(unref(mergedParams));
    if (beforeFetch) {
      finalParams = (await beforeFetch(finalParams)) ?? finalParams;
    }

    let res = await api(finalParams);
    if (afterFetch) {
      res = (await afterFetch(res)) ?? res;
    }

    isFirstLoaded.value = true;

    if (Array.isArray(res)) {
      refOptions.value = res;
    } else if (resultField) {
      refOptions.value = get(res, resultField) || [];
    }

    emitChange();
  } catch (error) {
    console.warn(error);
    isFirstLoaded.value = false;
  } finally {
    loading.value = false;
    if (hasPendingRequest.value) {
      hasPendingRequest.value = false;
      await nextTick();
      await fetchApi();
    }
  }
}

async function handleFetchForVisible(visible: boolean) {
  if (!visible) return;

  if (props.alwaysLoad) {
    await fetchApi();
  } else if (!props.immediate && !isFirstLoaded.value) {
    await fetchApi();
  }
}

watch(
  mergedParams,
  (val, oldVal) => {
    if (!isEqual(val, oldVal)) {
      fetchApi();
    }
  },
  { deep: true, immediate: props.immediate },
);

/* ---------------- 自动选中 ---------------- */

function emitChange() {
  if (
    modelValue.value === undefined &&
    props.autoSelect &&
    getOptions.value.length > 0
  ) {
    let option: OptionsItem | undefined;

    if (isFunction(props.autoSelect)) {
      option = props.autoSelect(getOptions.value);
    } else if (props.autoSelect === 'first') {
      option = getOptions.value[0];
    } else if (props.autoSelect === 'last') {
      option = getOptions.value.at(-1);
    } else if (props.autoSelect === 'one' && getOptions.value.length === 1) {
      option = getOptions.value[0];
    }

    if (option) {
      modelValue.value = props.multiple ? [option.value] : option.value;
    }
  }

  emit('optionsChange', getOptions.value);
}

/* ---------------- expose ---------------- */

defineExpose({
  getOptions: () => getOptions.value,
  getValue: () => modelValue.value,
  getComponentRef: <T = any,>() => componentRef.value as T,
  updateParam(newParams: Record<string, any>) {
    innerParams.value = newParams;
  },
  clearSearch() {
    searchTerm.value = '';
  },
  getCreatedOptions: () => createdOptions.value,
  clearCreatedOptions() {
    createdOptions.value = [];
  },
  setCreatedOptions(options: OptionsItem[]) {
    createdOptions.value = options;
  },
});
</script>

<template>
  <component :is="component" ref="componentRef" v-bind="bindProps">
    <template v-for="item in Object.keys($slots)" #[item]="data">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>

    <template v-if="loadingSlot && loading" #[loadingSlot]>
      <LoaderCircle class="animate-spin" />
    </template>
  </component>
</template>
