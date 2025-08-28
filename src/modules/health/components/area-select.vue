<template>
	<cl-select-table
		v-model="value"
		:title="t('选择区域信息')"
		:service="service.health.area"
		:columns="columns"
		:multiple="multiple"
		:dict="{ text: 'name' }"
		pickerType="text"
	/>
</template>

<script setup lang="ts">
defineOptions({
	name: "health-area-select",
});

import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { CrudProps } from "/#/crud";
import { ref, useModel } from "vue";

const props = defineProps({
	...CrudProps,
	modelValue: null,
	multiple: Boolean,
});

const { service } = useCool();
const { t } = useI18n();

const value = useModel(props, "modelValue");

const columns = ref([
	{ label: t("名称"), prop: "name", minWidth: 140 },
	{ label: t("位置"), prop: "location", minWidth: 140 },
	{ label: t("排序"), prop: "order", minWidth: 140, sortable: "custom" },
	{
		label: t("备注"),
		prop: "remark",
		showOverflowTooltip: true,
		minWidth: 200,
	},
]);
</script>
