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
	import { reactive, onMounted, computed } from "vue";

	const { service } = useCool();
	const { t } = useI18n();

	// 加载机构数据
	async function loadOrganizations() {
		try {
			const res = await service.intellectual.organization.list();
			if (res && res.length > 0) {
				// 过滤权利人类型的机构
				options.patenteeOptions = res
					.filter((item: any) => item.type === 1) // 权利人类型为1
					.map((item: any) => ({
						label: item.name,
						value: item.name,
					}));
				// 过滤代理机构类型的机构
				options.agencyOptions = res
					.filter((item: any) => item.type === 0) // 代理机构类型为0
					.map((item: any) => ({
						label: item.name,
						value: item.name,
					}));
			}
		} catch (error) {
			console.error("加载机构数据失败:", error);
		}
	}

	// 组件挂载时加载数据
	onMounted(() => {
		loadOrganizations();
	});

	// 选项
	const options = reactive({
		patentType: [
			{ label: t("发明专利"), value: 0 },
			{ label: t("实用新型专利"), value: 1 },
			{ label: t("外观设计专利"), value: 2 },
		],
		legalStatus: [
			{ label: t("待申请"), value: 0 },
			{ label: t("审查中"), value: 1 },
			{ label: t("已授权"), value: 2 },
			{ label: t("已驳回"), value: 3 },
			{ label: t("已失效"), value: 4 },
			{ label: t("待诉讼"), value: 5 },
			{ label: t("驳回复审"), value: 6 },
		],
		patentLevel: [
			{ label: t("壁垒专利"), value: 0 },
			{ label: t("重要专利"), value: 1 },
			{ label: t("普通专利"), value: 2 },
		],
		patenteeOptions: [] as Array<{ label: string; value: string }>,
		agencyOptions: [] as Array<{ label: string; value: string }>,
	});

	// cl-upsert
	const Upsert = useUpsert({
		items: [
			{
				label: t("名称"),
				prop: "name",
				component: { name: "el-input", props: { clearable: true, placeholder: t("请输入专利名称") } },
				span: 24,
				required: true,
			},
			{
				label: t("案号"),
				prop: "caseNumber",
				component: { name: "el-input", props: { clearable: true, placeholder: t("请输入案号") } },
				span: 12,
			},
			{
				label: t("专利号"),
				prop: "patentNumber",
				component: { name: "el-input", props: { clearable: true, placeholder: t("请输入专利号") } },
				span: 12,
			},
			{
				label: t("证书号"),
				prop: "certificateNumber",
				component: { name: "el-input", props: { clearable: true, placeholder: t("请输入证书号") } },
				span: 12,
			},
			{
				label: t("授权公告号"),
				prop: "authorizationAnnouncementNumber",
				component: { name: "el-input", props: { clearable: true, placeholder: t("请输入授权公告号") } },
				span: 12,
			},
			{
				label: t("申请日"),
				prop: "applicationDate",
				component: {
					name: "el-date-picker",
					props: { type: "date", valueFormat: "YYYY-MM-DD", placeholder: t("请选择申请日期") },
				},
				span: 12,
			},
			{
				label: t("证书日"),
				prop: "certificateDate",
				component: {
					name: "el-date-picker",
					props: { type: "date", valueFormat: "YYYY-MM-DD", placeholder: t("请选择证书日期") },
				},
				span: 12,
			},
			{
				label: t("专利权利人"),
				prop: "patentee",
				component: {
					name: "el-select",
					props: { clearable: true, filterable: true, placeholder: t("请选择专利权利人") },
					options: computed(() => options.patenteeOptions),
				},
				span: 24,
			},
			{
				label: t("专利类型"),
				prop: "patentType",
				component: { name: "el-radio-group", options: options.patentType },
				value: 0,
				required: true,
				span: 24,
			},
			{
				label: t("法律状态"),
				prop: "legalStatus",
				component: { name: "el-radio-group", options: options.legalStatus },
				value: 0,
				required: true,
				span: 24,
			},
			{
				label: t("发明人"),
				prop: "inventor",
				component: { name: "el-input", props: { clearable: true, placeholder: t("请输入发明人姓名，多个发明人用逗号分隔") } },
				span: 12,
			},
			{
				label: t("代理机构"),
				prop: "agency",
				component: {
					name: "el-select",
					props: { clearable: true, filterable: true, placeholder: t("请选择代理机构") },
					options: computed(() => options.agencyOptions),
				},
				span: 12,
			},
			{
				label: t("专利级别"),
				prop: "patentLevel",
				component: {
					name: "el-select",
					props: { clearable: true, placeholder: t("请选择专利级别") },
					options: options.patentLevel,
				},
				span: 24,
			},
			{
				label: t("权力要求"),
				prop: "claimsRequirement",
				component: {
					name: "el-input",
					props: {
						type: "textarea",
						rows: 4,
						clearable: true,
						placeholder: t("请输入权力要求"),
					},
				},
				span: 24,
			},
			{
				label: t("备注"),
				prop: "remark",
				component: {
					name: "el-input",
					props: {
						type: "textarea",
						rows: 3,
						clearable: true,
						placeholder: t("请输入备注"),
					},
				},
				span: 24,
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
			{ label: t("证书号"), prop: "certificateNumber", minWidth: 140 },
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
			{
				label: t("专利级别"),
				prop: "patentLevel",
				minWidth: 120,
				dict: options.patentLevel,
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
