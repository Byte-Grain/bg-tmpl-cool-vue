<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<cl-flex1 />
			<!-- 条件搜索 -->
			<cl-search ref="Search" />
		</cl-row>

		<cl-row>
			<!-- 数据表格 -->
			<cl-table ref="Table" />
		</cl-row>

		<cl-row>
			<cl-flex1 />
			<!-- 分页控件 -->
			<cl-pagination />
		</cl-row>

		<!-- 新增、编辑 -->
		<cl-upsert ref="Upsert" />
	</cl-crud>
</template>

<script lang="ts" setup>
defineOptions({
	name: "health-device",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	status: [
		{ label: t("禁用"), value: 0, type: "danger" },
		{ label: t("启用"), value: 1, type: "success" },
	],
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t("编号"),
			prop: "code",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("名称"),
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("型号"),
			prop: "model",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("SN"),
			prop: "sn",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("MAC"),
			prop: "mac",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("生产日期"),
			prop: "productionDate",
			component: {
				name: "el-date-picker",
				props: { type: "date", valueFormat: "YYYY-MM-DD" },
			},
			span: 12,
		},
		{
			label: t("使用年限"),
			prop: "usageYears",
			hook: "number",
			component: { name: "el-input-number", props: { min: 0 } },
			span: 12,
		},
		{
			label: t("状态"),
			prop: "status",
			component: { name: "el-radio-group", options: options.status },
			value: 1,
			required: true,
		},
		{
			label: t("生产厂商"),
			prop: "manufacturer",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("备注"),
			prop: "remark",
			component: {
				name: "el-input",
				props: { type: "textarea", rows: 4 },
			},
		},
	],
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: t("编号"), prop: "code", minWidth: 140 },
		{ label: t("名称"), prop: "name", minWidth: 140 },
		{ label: t("型号"), prop: "model", minWidth: 140 },
		{ label: t("SN"), prop: "sn", minWidth: 140 },
		{ label: t("MAC"), prop: "mac", minWidth: 140 },
		{
			label: t("生产日期"),
			prop: "productionDate",
			minWidth: 140,
			sortable: "custom",
			component: {
				name: "cl-date-text",
				props: { format: "YYYY-MM-DD" },
			},
		},
		{
			label: t("使用年限"),
			prop: "usageYears",
			minWidth: 140,
			sortable: "custom",
		},
		{
			label: t("状态"),
			prop: "status",
			minWidth: 120,
			dict: options.status,
		},
		{ label: t("生产厂商"), prop: "manufacturer", minWidth: 140 },
		{
			label: t("备注"),
			prop: "remark",
			showOverflowTooltip: true,
			minWidth: 200,
		},
		{
			label: t("创建时间"),
			prop: "createTime",
			minWidth: 170,
			sortable: "desc",
			component: { name: "cl-date-text" },
		},
		{
			label: t("更新时间"),
			prop: "updateTime",
			minWidth: 170,
			sortable: "custom",
			component: { name: "cl-date-text" },
		},
		{ type: "op", buttons: ["edit", "delete"] },
	],
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.health.device,
	},
	(app) => {
		app.refresh();
	},
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
