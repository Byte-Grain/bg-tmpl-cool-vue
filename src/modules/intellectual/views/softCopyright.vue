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
	name: 'intellectual-soft-copyright'
});

import { reactive, onMounted } from 'vue';
import { useUpsert, useCrud, useTable, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { useDict } from '/$/dict';

const { service } = useCool();
const { t } = useI18n();
const { dict } = useDict();

// 选项
const options = reactive({
	category: [],
	developmentMethod: [],
	acquisitionMethod: [],
	scopeOfRight: [],
	legalStatus: []
});

// 获取字典数据
const getDictData = async () => {
	const dictTypes = [
		'intellectual_software_category',
		'intellectual_development_method',
		'intellectual_acquisition_method',
		'intellectual_scope_of_right',
		'intellectual_software_legal_status'
	];

	// 使用字典store刷新数据
	await dict.refresh(dictTypes);

	// 从字典store获取数据
	Object.assign(options, {
		category: dict.get('intellectual_software_category').value || [],
		developmentMethod: dict.get('intellectual_development_method').value || [],
		acquisitionMethod: dict.get('intellectual_acquisition_method').value || [],
		scopeOfRight: dict.get('intellectual_scope_of_right').value || [],
		legalStatus: dict.get('intellectual_software_legal_status').value || []
	});
};

// 初始化字典数据
onMounted(() => {
	getDictData();
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		// 基本信息
		{
			label: t('名称'),
			prop: 'name',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('版本'),
			prop: 'version',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('简称'),
			prop: 'shortName',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('分类'),
			prop: 'category',
			component: { name: 'el-radio-group', options: options.category },
			value: 0,
			span: 12,
			required: true
		},
		// 编号信息
		{
			label: t('流水号'),
			prop: 'serialNumber',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('登记号'),
			prop: 'registrationNumber',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('证书号'),
			prop: 'certificateNumber',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('开发方式'),
			prop: 'developmentMethod',
			component: {
				name: 'el-select',
				options: options.developmentMethod,
				props: { clearable: true }
			},
			value: 0,
			span: 12
		},
		// 日期信息
		{
			label: t('完成日'),
			prop: 'completionDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
			},
			span: 12
		},
		{
			label: t('发表日'),
			prop: 'publicationDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
			},
			span: 12
		},
		{
			label: t('申请日'),
			prop: 'applicationDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
			},
			span: 12
		},
		{
			label: t('法律状态'),
			prop: 'legalStatus',
			component: {
				name: 'el-select',
				options: options.legalStatus,
				props: { clearable: true }
			},
			value: 0,
			span: 12,
			required: true
		},
		// 权利信息
		{
			label: t('取得方式'),
			prop: 'acquisitionMethod',
			component: {
				name: 'el-radio-group',
				options: options.acquisitionMethod
			},
			value: 0,
			span: 12
		},
		{
			label: t('权利范围'),
			prop: 'scopeOfRight',
			component: {
				name: 'el-radio-group',
				options: options.scopeOfRight
			},
			value: 0,
			span: 12
		},
		// 人员信息
		{
			label: t('权利人'),
			prop: 'rightHolder',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		},
		{
			label: t('申请人'),
			prop: 'applicant',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('名称'), prop: 'name', minWidth: 140 },
		{ label: t('版本'), prop: 'version', minWidth: 140 },
		{ label: t('简称'), prop: 'shortName', minWidth: 140 },
		{
			label: t('分类'),
			prop: 'category',
			minWidth: 120,
			dict: options.category
		},
		{ label: t('流水号'), prop: 'serialNumber', minWidth: 140 },
		{ label: t('登记号'), prop: 'registrationNumber', minWidth: 140 },
		{ label: t('证书号'), prop: 'certificateNumber', minWidth: 140 },
		{
			label: t('开发方式'),
			prop: 'developmentMethod',
			minWidth: 120,
			dict: options.developmentMethod
		},
		{
			label: t('完成日'),
			prop: 'completionDate',
			minWidth: 140,
			sortable: 'custom',
			component: {
				name: 'cl-date-text',
				props: { format: 'YYYY-MM-DD' }
			}
		},
		{
			label: t('发表日'),
			prop: 'publicationDate',
			minWidth: 140,
			sortable: 'custom',
			component: {
				name: 'cl-date-text',
				props: { format: 'YYYY-MM-DD' }
			}
		},
		{
			label: t('申请日'),
			prop: 'applicationDate',
			minWidth: 140,
			sortable: 'custom',
			component: {
				name: 'cl-date-text',
				props: { format: 'YYYY-MM-DD' }
			}
		},
		{
			label: t('取得方式'),
			prop: 'acquisitionMethod',
			minWidth: 120,
			dict: options.acquisitionMethod
		},
		{ label: t('权利人'), prop: 'rightHolder', minWidth: 140 },
		{
			label: t('权利范围'),
			prop: 'scopeOfRight',
			minWidth: 120,
			dict: options.scopeOfRight
		},
		{ label: t('申请人'), prop: 'applicant', minWidth: 140 },
		{
			label: t('法律状态'),
			prop: 'legalStatus',
			minWidth: 120,
			dict: options.legalStatus
		},
		{
			label: t('创建时间'),
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc',
			component: { name: 'cl-date-text' }
		},
		{
			label: t('更新时间'),
			prop: 'updateTime',
			minWidth: 170,
			sortable: 'custom',
			component: { name: 'cl-date-text' }
		},
		{ type: 'op', buttons: ['edit', 'delete'] }
	]
});

// cl-search
const Search = useSearch();

// cl-crud
const Crud = useCrud(
	{
		service: service.intellectual.softCopyright
	},
	app => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}
</script>
