<template>
	<cl-select-table
		v-model="value"
		:title="t('选择用户管理')"
		:service="service.health.user"
		:columns="columns"
		:multiple="multiple"
		:dict="{ text: 'name' }"
		pickerType="text"
	/>
</template>

<script setup lang="ts">
defineOptions({
	name: "health-user-select",
});

import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { CrudProps } from "/#/crud";
import { reactive, ref, useModel } from "vue";

const props = defineProps({
	...CrudProps,
	modelValue: null,
	multiple: Boolean,
});

const { service } = useCool();
const { t } = useI18n();

const value = useModel(props, "modelValue");

// 选项
const options = reactive({
	gender: [
		{ label: t("未知"), value: 0 },
		{ label: t("男"), value: 1 },
		{ label: t("女"), value: 2 },
	],
});

const columns = ref([
	{ label: t("账号"), prop: "account", minWidth: 140 },
	{ label: t("姓名"), prop: "name", minWidth: 140 },
	{ label: t("性别"), prop: "gender", minWidth: 120, dict: options.gender },
	{ label: t("年龄"), prop: "age", minWidth: 140, sortable: "custom" },
	{ label: t("电话"), prop: "phone", minWidth: 140 },
	{
		label: t("地址"),
		prop: "address",
		showOverflowTooltip: true,
		minWidth: 200,
	},
	{
		label: t("备注"),
		prop: "remark",
		showOverflowTooltip: true,
		minWidth: 200,
	},
]);
</script>
