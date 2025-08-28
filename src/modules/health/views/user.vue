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
	import { reactive, ref } from "vue";

	const { service } = useCool();
	const { t } = useI18n();

	const dateCalc = ref(false);

	// 选项
	const options = reactive({
		gender: [
			{ label: t("未知"), value: 0 },
			{ label: t("男"), value: 1 },
			{ label: t("女"), value: 2 },
		],
	});

	setInterval(() => {
		console.log("------switch", dateCalc.value);
	}, 1000);

	// cl-upsert
	const Upsert = useUpsert({
		items: [
			{
				label: t("编号"),
				prop: "number",
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
				span: 12
			},
			// 出生日期
			{
				label: t("出生日期"),
				prop: "birthDate",
				component: { name: "el-date-picker", props: { type: "date" } },
				span: 24,
			},
			{
				label: t("年龄(岁)"),
				prop: "ageYear",
				component: { name: "el-input-number", props: { clearable: true, min: 0, max: 300 } },
				span: 8,
			},
			{
				label: t("年龄(周)"),
				prop: "ageWeek",
				component: { name: "el-input-number", props: { clearable: true, min: 0, max: 54 } },
				span: 8,
			},
			{
				label: t("年龄(天)"),
				prop: "ageDay",
				component: { name: "el-input-number", props: { clearable: true, min: 0, max: 100 } },
				span: 8,
			},
			{
				label: t("身高"),
				prop: "height",
				component: { name: "el-input-number", props: { clearable: true } },
				span: 12,
			},
			{
				label: t("体重"),
				prop: "weight",
				component: { name: "el-input-number", props: { clearable: true } },
				span: 12,
			},
			{
				label: t("电话"),
				prop: "phone",
				component: { name: "el-input", props: { clearable: true } },
				span: 8,
			},
			{
				label: t("地址"),
				prop: "address",
				component: { name: "el-input", props: { clearable: true } },
				span: 16,
			},
			{
				label: t("备注"),
				prop: "remark",
				component: { name: "el-input", props: { clearable: true, type: "textarea", row: 4 } },
				span: 24,
			},
		],
	});

	// cl-table
	const Table = useTable({
		columns: [
			{ type: "selection" },
			{ label: t("编号"), prop: "number", minWidth: 120 },
			{ label: t("姓名"), prop: "name", minWidth: 120 },
			{
				label: t("性别"),
				prop: "gender",
				minWidth: 120,
				dict: options.gender,
			},
			{ label: t("年龄"), prop: "age", minWidth: 120 },
			{ label: t("身高"), prop: "height", minWidth: 120 },
			{ label: t("体重"), prop: "weight", minWidth: 120 },
			{ label: t("电话"), prop: "phone", minWidth: 120 },
			{ label: t("地址"), prop: "address", minWidth: 120 },
			{ label: t("备注"), prop: "remark", minWidth: 120 },
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
