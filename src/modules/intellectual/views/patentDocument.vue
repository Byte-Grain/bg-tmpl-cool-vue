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
	name: 'intellectual-patent-document'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive, ref, onMounted, computed } from 'vue';
import { useDict } from '/@/modules/dict';

const { service } = useCool();
const { t } = useI18n();
const { dict } = useDict();

// 专利搜索选项
const patentOptions = ref<Array<{ label: string; value: string; data: any }>>([]);

// 响应式字典数据
const documentTypeOptions = computed(() => dict.get('intellectual_document_type').value || []);
const documentNameOptions = computed(
	() => dict.get('intellectual_patent_document_name').value || []
);

// 获取字典数据
const getDictData = async () => {
	const dictTypes = ['intellectual_document_type', 'intellectual_patent_document_name'];

	// 使用字典store刷新数据
	await dict.refresh(dictTypes);

	console.log(t('专利收文字典数据加载'), {
		documentType: documentTypeOptions.value,
		documentName: documentNameOptions.value
	});
};

// 初始化字典数据
onMounted(async () => {
	await getDictData();
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('专利号'),
			prop: 'patentNumber',
			component: {
				name: 'el-select',
				props: {
					clearable: true,
					filterable: true,
					remote: true,
					reserveKeyword: false,
					remoteMethod: async (keyword: string) => {
						if (!keyword) {
							patentOptions.value = [];
							return;
						}
						try {
							const res = await service.intellectual.patent.page({
								page: 1,
								size: 10,
								keyWord: keyword
							});
							const mappedList = res.list.map((item: any) => {
								return {
									label: `${item.patentNumber} - ${item.name}`,
									value: item.patentNumber,
									data: item
								};
							});
							patentOptions.value = mappedList;
						} catch (error) {
							console.error(t('搜索专利失败'), error);
							patentOptions.value = [];
						}
					},
					placeholder: t('请输入专利号或专利名称搜索')
				},
				options: patentOptions
			},
			span: 12,
			required: true
		},
		{
			label: t('类型'),
			prop: 'type',
			component: {
				name: 'el-select',
				options: documentTypeOptions,
				props: { clearable: true }
			},
			span: 12,
			required: true
		},
		{
			label: t('名称'),
			prop: 'name',
			component: {
				name: 'el-select',
				options: documentNameOptions,
				props: { clearable: true }
			},
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
				props: {
					type: 'file',
					multiple: false,
					limit: 1,
					listType: 'picture-card',
					accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx'
				}
			},
			required: true
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('专利号'), prop: 'patentNumber', minWidth: 140 },
		{ label: t('专利名称'), prop: 'patentName', minWidth: 180 },
		{
			label: t('类型'),
			prop: 'type',
			minWidth: 120,
			dict: documentTypeOptions
		},
		{
			label: t('名称'),
			prop: 'name',
			minWidth: 140,
			dict: documentNameOptions
		},
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
		service: service.intellectual.patentDocument
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
