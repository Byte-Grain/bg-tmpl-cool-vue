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
	name: "health-task",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";
import UserSelect from "/$/health/components/user-select.vue";

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
			label: t("名称"),
			prop: "name",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
			required: true,
		},
		{
			label: t("选择关联用户"),
			prop: "userId",
			component: { vm: UserSelect },
			span: 12,
		},
		{
			label: t("范式类型"),
			prop: "paradigmType",
			component: { name: "el-input", props: { clearable: true } },
			span: 12,
		},
		{
			label: t("任务配置"),
			prop: "taskConfig",
			component: {
				name: "el-input",
				props: { type: "textarea", rows: 4 },
			},
		},
		{
			label: t("设备配置"),
			prop: "deviceConfig",
			component: {
				name: "el-input",
				props: { type: "textarea", rows: 4 },
			},
		},
		{
			label: t("状态"),
			prop: "status",
			component: { name: "el-radio-group", options: options.status },
			value: 1,
			required: true,
		},
		{
			label: t("时间范围"),
			prop: "time",
			component: {
				name: "el-date-picker",
				props: {
					type: "datetimerange",
					valueFormat: "YYYY-MM-DD HH:mm:ss",
					defaultTime: [
						"2000-01-31T16:00:00.000Z",
						"2000-02-01T15:59:59.000Z",
					],
				},
			},
			span: 12,
			hook: "datetimeRange",
		},
		{
			label: t("任务时长"),
			prop: "taskDuration",
			hook: "number",
			component: { name: "el-input-number", props: { min: 0 } },
			span: 12,
		},
	],
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: t("姓名"), prop: "userName", minWidth: 140 },
		{ label: t("名称"), prop: "name", minWidth: 140 },
		{ label: t("范式类型"), prop: "paradigmType", minWidth: 120 },
		{
			label: t("任务配置"),
			prop: "taskConfig",
			showOverflowTooltip: true,
			minWidth: 200,
		},
		{
			label: t("设备配置"),
			prop: "deviceConfig",
			showOverflowTooltip: true,
			minWidth: 200,
		},
		{
			label: t("状态"),
			prop: "status",
			minWidth: 120,
			dict: options.status,
		},
		{
			label: t("开始时间"),
			prop: "startTime",
			minWidth: 170,
			sortable: "custom",
			component: { name: "cl-date-text" },
		},
		{
			label: t("结束时间"),
			prop: "endTime",
			minWidth: 170,
			sortable: "custom",
			component: { name: "cl-date-text" },
		},
		{
			label: t("任务时长"),
			prop: "taskDuration",
			minWidth: 140,
			sortable: "custom",
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
		service: service.health.task,
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
