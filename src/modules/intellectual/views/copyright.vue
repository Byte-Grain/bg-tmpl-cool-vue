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
	name: "intellectual-copyright",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	category: [
		{ label: t("软件"), value: 0, type: "danger" },
		{ label: t("作品"), value: 1, type: "success" },
	],
	legalStatus: [
		{ label: t("有效"), value: 0, type: "danger" },
		{ label: t("无效"), value: 1, type: "success" },
	],
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t("名称"),
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("版本"),
			prop: "version",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("简称"),
			prop: "shortName",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("分类"),
			prop: "category",
			component: { name: "el-radio-group", options: options.category },
			value: 0,
			required: true,
		},
		{
			label: t("流水号"),
			prop: "serialNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("登记号"),
			prop: "registrationNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("证书号"),
			prop: "certificateNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("开发方式"),
			prop: "developmentMethod",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("完成日"),
			prop: "completionDate",
			component: {
				name: "el-date-picker",
				props: { type: "date", valueFormat: "YYYY-MM-DD" },
			},
			span: 12,
		},
		{
			label: t("发表日"),
			prop: "publicationDate",
			component: {
				name: "el-date-picker",
				props: { type: "date", valueFormat: "YYYY-MM-DD" },
			},
			span: 12,
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
			label: t("取得方式"),
			prop: "acquisitionMethod",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("权利人"),
			prop: "rightHolder",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("权利范围"),
			prop: "scopeOfRights",
			component: {
				name: "el-input",
				props: { type: "textarea", rows: 4 },
			},
		},
		{
			label: t("申请人"),
			prop: "applicant",
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
		{ label: t("名称"), prop: "name", minWidth: 140 },
		{ label: t("版本"), prop: "version", minWidth: 140 },
		{ label: t("简称"), prop: "shortName", minWidth: 140 },
		{
			label: t("分类"),
			prop: "category",
			minWidth: 120,
			dict: options.category,
		},
		{ label: t("流水号"), prop: "serialNumber", minWidth: 140 },
		{ label: t("登记号"), prop: "registrationNumber", minWidth: 140 },
		{ label: t("证书号"), prop: "certificateNumber", minWidth: 140 },
		{ label: t("开发方式"), prop: "developmentMethod", minWidth: 120 },
		{
			label: t("完成日"),
			prop: "completionDate",
			minWidth: 140,
			sortable: "custom",
			component: {
				name: "cl-date-text",
				props: { format: "YYYY-MM-DD" },
			},
		},
		{
			label: t("发表日"),
			prop: "publicationDate",
			minWidth: 140,
			sortable: "custom",
			component: {
				name: "cl-date-text",
				props: { format: "YYYY-MM-DD" },
			},
		},
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
		{ label: t("取得方式"), prop: "acquisitionMethod", minWidth: 120 },
		{ label: t("权利人"), prop: "rightHolder", minWidth: 140 },
		{
			label: t("权利范围"),
			prop: "scopeOfRights",
			showOverflowTooltip: true,
			minWidth: 200,
		},
		{ label: t("申请人"), prop: "applicant", minWidth: 140 },
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
		service: service.intellectual.copyright,
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
