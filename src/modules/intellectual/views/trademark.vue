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
	name: "intellectual-trademark",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	type: [
		{ label: t("文字商标"), value: 0 },
		{ label: t("图形商标"), value: 1 },
		{ label: t("组合商标"), value: 2 },
	],
	legalStatus: [
		{ label: t("有效"), value: 0 },
		{ label: t("无效"), value: 1 },
		{ label: t("审中"), value: 2 },
	],
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t("注册号"),
			prop: "registrationNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("来源"),
			prop: "source",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("类型"),
			prop: "type",
			component: { name: "el-radio-group", options: options.type },
			value: 0,
			required: true,
		},
		{
			label: t("名称"),
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{ label: t("图片"), prop: "image", component: { name: "cl-upload" } },
		{
			label: t("分类号"),
			prop: "classificationNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("注册人"),
			prop: "registrant",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("申请日"),
			prop: "applicationDate",
			component: {
				name: "el-date-picker",
				props: { type: "date", valueFormat: "YYYY-MM-DD" },
			},
			span: 12,
		},
		{
			label: t("服务内容"),
			prop: "serviceContent",
			component: {
				name: "el-input",
				props: { type: "textarea", rows: 4 },
			},
		},
		{
			label: t("代理机构"),
			prop: "agency",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("法律状态"),
			prop: "legalStatus",
			component: { name: "el-radio-group", options: options.legalStatus },
			value: 0,
			required: true,
		},
	],
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: t("注册号"), prop: "registrationNumber", minWidth: 140 },
		{ label: t("来源"), prop: "source", minWidth: 120 },
		{ label: t("类型"), prop: "type", minWidth: 120, dict: options.type },
		{ label: t("名称"), prop: "name", minWidth: 140 },
		{
			label: t("图片"),
			prop: "image",
			minWidth: 100,
			component: { name: "cl-image", props: { size: 60 } },
		},
		{ label: t("分类号"), prop: "classificationNumber", minWidth: 140 },
		{ label: t("注册人"), prop: "registrant", minWidth: 140 },
		{
			label: t("申请日"),
			prop: "applicationDate",
			minWidth: 140,
			sortable: "custom",
			component: {
				name: "cl-date-text",
				props: { format: "YYYY-MM-DD" },
			},
		},
		{
			label: t("服务内容"),
			prop: "serviceContent",
			showOverflowTooltip: true,
			minWidth: 200,
		},
		{ label: t("代理机构"), prop: "agency", minWidth: 140 },
		{
			label: t("法律状态"),
			prop: "legalStatus",
			minWidth: 120,
			dict: options.legalStatus,
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
		service: service.intellectual.trademark,
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
