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
	name: 'intellectual-trademark'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive, onMounted, computed } from 'vue';
import { useDict } from '/@/modules/dict';

const { service } = useCool();
const { t } = useI18n();
const { dict } = useDict();

// 加载机构数据
async function loadOrganizations() {
	try {
		const res = await service.intellectual.organization.list();
		if (res && Array.isArray(res)) {
			// 专利权利人（机构类型为1）
			options.registrantOptions = res
				.filter((item: any) => item.type === 1) // 专利权利人类型为1
				.map((item: any) => ({
					label: item.name,
					value: item.name
				}));
			// 代理机构（机构类型为0）
			options.agencyOptions = res
				.filter((item: any) => item.type === 0) // 代理机构类型为0
				.map((item: any) => ({
					label: item.name,
					value: item.name
				}));
		}
	} catch (error) {
		console.error('加载机构数据失败:', error);
	}
}

// 组件挂载时加载数据
onMounted(() => {
	loadOrganizations();
});

// 选项
const options = reactive({
	registrantOptions: [] as Array<{ label: string; value: string }>,
	agencyOptions: [] as Array<{ label: string; value: string }>
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		// 基本信息
		{
			label: t('注册号'),
			prop: 'registrationNumber',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('名称'),
			prop: 'name',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('类型'),
			prop: 'type',
			component: {
				name: 'el-select',
				options: dict.get('intellectual_trademark_type'),
				props: { clearable: true, placeholder: '请选择类型' }
			},
			span: 12,
			value: 0,
			required: true
		},
		{
			label: t('分类号'),
			prop: 'classificationNumber',
			component: {
				name: 'el-select',
				options: dict.get('intellectual_trademark_classification'),
				props: { clearable: true, placeholder: '请选择分类号' }
			},
			span: 12
		},
		{
			label: t('来源'),
			prop: 'source',
			component: {
				name: 'el-select',
				options: dict.get('intellectual_trademark_source'),
				props: { clearable: true, placeholder: '请选择来源' }
			},
			span: 12
		},
		{
			label: t('法律状态'),
			prop: 'legalStatus',
			component: {
				name: 'el-select',
				options: dict.get('intellectual_trademark_status'),
				props: { clearable: true, placeholder: '请选择法律状态' }
			},
			span: 12,
			value: 0,
			required: true
		},
		// 权利人信息
		{
			label: t('注册人'),
			prop: 'registrant',
			component: {
				name: 'el-select',
				props: { clearable: true, filterable: true, placeholder: t('请选择注册人') },
				options: computed(() => options.registrantOptions)
			},
			span: 12,
			required: true
		},
		{
			label: t('代理机构'),
			prop: 'agency',
			component: {
				name: 'el-select',
				props: { clearable: true, filterable: true, placeholder: t('请选择代理机构') },
				options: computed(() => options.agencyOptions)
			},
			span: 12
		},
		// 时间信息
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
			label: t('注册生效日'),
			prop: 'registrationEffectiveDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
			},
			span: 12
		},
		{
			label: t('有效期'),
			prop: 'validityPeriod',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
			},
			span: 12
		},
		// 服务内容
		{
			label: t('申请服务内容'),
			prop: 'applicationServiceContent',
			component: {
				name: 'el-input',
				props: { type: 'textarea', rows: 4 }
			},
			span: 24
		},
		{
			label: t('核定使用商品/服务项目'),
			prop: 'approvedGoodsServices',
			component: {
				name: 'el-input',
				props: { type: 'textarea', rows: 4 }
			},
			span: 24
		},		// 图片上传
		{
			label: t('图片'),
			prop: 'image',
			component: { name: 'cl-upload' },
			span: 24
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('注册号'), prop: 'registrationNumber', minWidth: 140 },
		{
			label: t('来源'),
			prop: 'source',
			minWidth: 120,
			dict: dict.get('intellectual_trademark_source')
		},
		{
			label: t('类型'),
			prop: 'type',
			minWidth: 120,
			dict: dict.get('intellectual_trademark_type')
		},
		{ label: t('名称'), prop: 'name', minWidth: 140 },
		{
			label: t('图片'),
			prop: 'image',
			minWidth: 100,
			component: { name: 'cl-image', props: { size: 60 } }
		},
		{
			label: t('分类号'),
			prop: 'classificationNumber',
			minWidth: 140,
			dict: dict.get('intellectual_trademark_classification')
		},
		{ label: t('注册人'), prop: 'registrant', minWidth: 140 },
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
			label: t('注册生效日'),
			prop: 'registrationEffectiveDate',
			minWidth: 140,
			sortable: 'custom',
			component: {
				name: 'cl-date-text',
				props: { format: 'YYYY-MM-DD' }
			}
		},
		{
			label: t('有效期'),
			prop: 'validityPeriod',
			minWidth: 140,
			sortable: 'custom',
			component: {
				name: 'cl-date-text',
				props: { format: 'YYYY-MM-DD' }
			}
		},
		{
			label: t('申请服务内容'),
			prop: 'applicationServiceContent',
			showOverflowTooltip: true,
			minWidth: 200
		},
		{
			label: t('核定使用商品/服务项目'),
			prop: 'approvedGoodsServices',
			showOverflowTooltip: true,
			minWidth: 200
		},
		{ label: t('代理机构'), prop: 'agency', minWidth: 140 },
		{
			label: t('法律状态'),
			prop: 'legalStatus',
			minWidth: 120,
			dict: dict.get('intellectual_trademark_status')
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
		service: service.intellectual.trademark
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
