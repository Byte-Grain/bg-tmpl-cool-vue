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
	name: "intellectual-patent",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";

const { service } = useCool();
const { t } = useI18n();

// 选项
const options = reactive({
	patentType: [
		{ label: t("发明专利"), value: 0 },
		{ label: t("实用新型专利"), value: 1 },
		{ label: t("外观设计专利"), value: 2 },
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
			label: t("案号"),
			prop: "caseNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("专利号"),
			prop: "patentNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("名称"),
			prop: "name",
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
			label: t("证书日"),
			prop: "certificateDate",
			component: {
				name: "el-date-picker",
				props: { type: "date", valueFormat: "YYYY-MM-DD" },
			},
			span: 12,
		},
		{
			label: t("专利权利人"),
			prop: "patentee",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("专利类型"),
			prop: "patentType",
			component: { name: "el-radio-group", options: options.patentType },
			value: 0,
			required: true,
		},
		{
			label: t("法律状态"),
			prop: "legalStatus",
			component: { name: "el-radio-group", options: options.legalStatus },
			value: 0,
			required: true,
		},
		{
			label: t("发明人"),
			prop: "inventor",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("代理机构"),
			prop: "agency",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("授权公告号"),
			prop: "authorizationAnnouncementNumber",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("专利级别"),
			prop: "patentLevel",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
	],
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: t("案号"), prop: "caseNumber", minWidth: 140 },
		{ label: t("专利号"), prop: "patentNumber", minWidth: 140 },
		{ label: t("名称"), prop: "name", minWidth: 140 },
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
			label: t("证书日"),
			prop: "certificateDate",
			minWidth: 140,
			sortable: "custom",
			component: {
				name: "cl-date-text",
				props: { format: "YYYY-MM-DD" },
			},
		},
		{ label: t("专利权利人"), prop: "patentee", minWidth: 140 },
		{
			label: t("专利类型"),
			prop: "patentType",
			minWidth: 120,
			dict: options.patentType,
		},
		{
			label: t("法律状态"),
			prop: "legalStatus",
			minWidth: 120,
			dict: options.legalStatus,
		},
		{ label: t("发明人"), prop: "inventor", minWidth: 140 },
		{ label: t("代理机构"), prop: "agency", minWidth: 140 },
		{
			label: t("授权公告号"),
			prop: "authorizationAnnouncementNumber",
			minWidth: 140,
		},
		{ label: t("专利级别"), prop: "patentLevel", minWidth: 120 },
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
		service: service.intellectual.patent,
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
