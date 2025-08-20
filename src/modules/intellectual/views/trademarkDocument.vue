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
	name: 'intellectual-trademark-document'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive, onMounted } from 'vue';
import { useDict } from '/@/modules/dict';

const { service } = useCool();
const { t } = useI18n();
const { dict } = useDict();

// 选项配置
const options = reactive({
	documentType: []
});

// 获取字典数据
const getDictData = async () => {
	const dictTypes = ['intellectual_trademark_document_type'];

	// 使用字典store刷新数据
	await dict.refresh(dictTypes);

	// 从字典store获取数据
	Object.assign(options, {
		documentType: dict.get('intellectual_trademark_document_type').value || []
	});
};

// 初始化字典数据
onMounted(() => {
	getDictData();
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('注册号'),
			prop: 'registrationNumber',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('类型'),
			prop: 'type',
			component: {
				name: 'el-select',
				options: options.documentType,
				props: { clearable: true }
			},
			span: 12
		},
		{
			label: t('名称'),
			prop: 'name',
			component: { name: 'el-input', props: { clearable: true } },
			span: 12,
			required: true
		},
		{
			label: t('日期'),
			prop: 'date',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD' }
			},
			span: 12
		},
		{
			label: t('附件'),
			prop: 'attachment',
			component: {
				name: 'cl-upload',
				props: { type: 'file', multiple: false, limit: 1 }
			}
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('注册号'), prop: 'registrationNumber', minWidth: 140 },
		{ label: t('类型'), prop: 'type', minWidth: 120 },
		{ label: t('名称'), prop: 'name', minWidth: 140 },
		{
			label: t('日期'),
			prop: 'date',
			minWidth: 140,
			sortable: 'custom',
			component: {
				name: 'cl-date-text',
				props: { format: 'YYYY-MM-DD' }
			}
		},
		{
			label: t('附件'),
			prop: 'attachment',
			minWidth: 120,
			component: { name: 'cl-link' }
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
		service: service.intellectual.trademarkDocument
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
