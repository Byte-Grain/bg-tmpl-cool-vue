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
	name: "health-user",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	gender: [
		{ label: t("未知"), value: 0 },
		{ label: t("男"), value: 1 },
		{ label: t("女"), value: 2 },
	],
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t("账号"),
			prop: "account",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("姓名"),
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("性别"),
			prop: "gender",
			component: { name: "el-radio-group", options: options.gender },
			value: 0,
			required: true,
		},
		{
			label: t("年龄"),
			prop: "age",
			hook: "number",
			component: { name: "el-input-number", props: { min: 0 } },
			span: 12,
		},
		{
			label: t("电话"),
			prop: "phone",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("地址"),
			prop: "address",
			component: {
				name: "el-input",
				props: { type: "textarea", rows: 4 },
			},
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
		{ label: t("账号"), prop: "account", minWidth: 140 },
		{ label: t("姓名"), prop: "name", minWidth: 140 },
		{
			label: t("性别"),
			prop: "gender",
			minWidth: 120,
			dict: options.gender,
		},
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
		service: service.health.user,
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
