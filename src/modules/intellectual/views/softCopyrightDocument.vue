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
	name: "intellectual-soft-copyright-document",
});

import { useCrud, useTable, useUpsert, useSearch } from "@cool-vue/crud";
import { useCool } from "/@/cool";
import { useI18n } from "vue-i18n";
import { reactive } from "vue";

const { service } = useCool();
const { t } = useI18n();

// 选项配置
const options = reactive({
	legalStatus: [
		{ label: t("未进行"), value: 0 },
		{ label: t("待提交"), value: 1 },
		{ label: t("待受理"), value: 2 },
		{ label: t("受理"), value: 3 },
		{ label: t("审查"), value: 4 },
		{ label: t("登记"), value: 5 },
		{ label: t("转让"), value: 6 },
		{ label: t("许可使用"), value: 7 },
	],
	documentType: [
		{ label: t("电子发文"), value: 0 },
		{ label: t("纸质发文"), value: 1 },
	],
	documentName: [
		{ label: t("版权登记表"), value: 0 },
		{ label: t("版权证书"), value: 1 },
		{ label: t("补正通知"), value: 2 },
	],
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		// 监听流水号变化，自动填充相关信息
		{
			label: "",
			prop: "_serialNumberWatcher",
			hook: {
				bind(value: any, { scope }: any) {
					// 监听流水号字段变化
					scope.$watch(
						() => scope.form.serialNumber,
						async (newVal: string) => {
							if (newVal) {
								try {
									const res = await service.intellectual.softCopyright.page({
										page: 1,
										size: 1,
										serialNumber: newVal
									});
									if (res.list && res.list.length > 0) {
										const item = res.list[0];
										scope.form.softCopyrightName = item.name;
										scope.form.legalStatus = item.legalStatus;
									}
								} catch (error) {
									console.error('获取软著信息失败:', error);
								}
							}
						}
					);
				}
			},
			hidden: true
		},
		{
			label: t("流水号"),
			prop: "serialNumber",
			component: {
				name: "cl-select",
				props: {
					clearable: true,
					filterable: true,
					remote: true,
					reserveKeyword: false,
					remoteMethod: async (keyword: string) => {
						if (!keyword) return [];
						try {
							const res = await service.intellectual.softCopyright.page({
								page: 1,
								size: 10,
								keyword,
							});
							return res.list.map((item: any) => ({
								label: `${item.serialNumber} - ${item.name} (${options.legalStatus.find(s => s.value === item.legalStatus)?.label || ''})`,
								value: item.serialNumber,
								data: item,
							}));
						} catch (error) {
							console.error('搜索软著失败:', error);
							return [];
						}
					},
					placeholder: t("请输入流水号或软著名称搜索")
				}
			},
			span: 12,
			required: true,
		},
		{
			label: t("软著名称"),
			prop: "softCopyrightName",
			component: { name: "el-input", props: { clearable: true, disabled: true } },
			span: 12,
		},
		{
			label: t("法律状态"),
			prop: "legalStatus",
			component: {
				name: "el-select",
				options: options.legalStatus,
				props: { clearable: true, disabled: true }
			},
			span: 12,
		},
		{
			label: t("类型"),
			prop: "type",
			component: {
				name: "el-select",
				options: options.documentType,
				props: { clearable: true }
			},
			span: 12,
			required: true,
		},
		{
			label: t("名称"),
			prop: "name",
			component: {
				name: "el-select",
				options: options.documentName,
				props: { clearable: true }
			},
			span: 12,
			required: true,
		},
		{
			label: t("日期"),
			prop: "date",
			component: {
				name: "el-date-picker",
				props: { type: "date", valueFormat: "YYYY-MM-DD" },
			},
			span: 12,
		},
		{
			label: t("附件"),
			prop: "attachment",
			component: {
				name: "cl-upload",
				props: { type: "file", multiple: true, limit: 10 },
			},
		},
	],
});

// cl-table
const Table = useTable({
	columns: [
		{ type: "selection" },
		{ label: t("流水号"), prop: "serialNumber", minWidth: 140 },
		{ label: t("软著名称"), prop: "softCopyrightName", minWidth: 180 },
		{
			label: t("法律状态"),
			prop: "legalStatus",
			minWidth: 120,
			dict: options.legalStatus,
		},
		{
			label: t("类型"),
			prop: "type",
			minWidth: 120,
			dict: options.documentType,
		},
		{
			label: t("名称"),
			prop: "name",
			minWidth: 140,
			dict: options.documentName,
		},
		{
			label: t("日期"),
			prop: "date",
			minWidth: 140,
			sortable: "custom",
			component: {
				name: "cl-date-text",
				props: { format: "YYYY-MM-DD" },
			},
		},
		{
			label: t("附件"),
			prop: "attachment",
			minWidth: 120,
			component: { name: "cl-link" },
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
		service: service.intellectual.softCopyrightDocument,
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
