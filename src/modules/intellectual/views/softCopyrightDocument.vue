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
	name: 'intellectual-soft-copyright-document'
});

import { useCrud, useTable, useUpsert, useSearch } from '@cool-vue/crud';
import { useCool } from '/@/cool';
import { useI18n } from 'vue-i18n';
import { reactive, ref, onMounted } from 'vue';
import { useDict } from '/@/modules/dict';

const { service } = useCool();
const { t } = useI18n();
const { dict } = useDict();

// 软著搜索选项
const softCopyrightOptions = ref<Array<{ label: string; value: string; data: any }>>([]);

// 选项配置
const options = reactive({
	documentType: [],
	documentName: []
});

// 获取字典数据
const getDictData = async () => {
	const dictTypes = ['intellectual_document_type', 'intellectual_soft_copyright_document_name'];

	// 使用字典store刷新数据
	await dict.refresh(dictTypes);

	// 从字典store获取数据
	Object.assign(options, {
		documentType: dict.get('intellectual_document_type').value || [],
		documentName: dict.get('intellectual_soft_copyright_document_name').value || []
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
			label: t('流水号'),
			prop: 'serialNumber',
			component: {
				name: 'el-select',
				props: {
					clearable: true,
					filterable: true,
					remote: true,
					reserveKeyword: false,
					remoteMethod: async (keyword: string) => {
						if (!keyword) {
							softCopyrightOptions.value = [];
							return;
						}
						try {
							const res = await service.intellectual.softCopyright.page({
								page: 1,
								size: 10,
								keyWord: keyword
							});
							const mappedList = res.list.map((item: any) => {
								return {
									label: `${item.serialNumber} - ${item.name}`,
									value: item.serialNumber,
									data: item
								};
							});
							softCopyrightOptions.value = mappedList;
						} catch (error) {
							console.error('搜索软著失败:', error);
							softCopyrightOptions.value = [];
						}
					},
					placeholder: t('请输入流水号或软著名称搜索')
				},
				options: softCopyrightOptions
			},
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
			span: 12,
			required: true
		},
		{
			label: t('名称'),
			prop: 'name',
			component: {
				name: 'el-select',
				options: options.documentName,
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
			}
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('流水号'), prop: 'serialNumber', minWidth: 140 },
		{ label: t('软著名称'), prop: 'softCopyrightName', minWidth: 180 },
		{
			label: t('类型'),
			prop: 'type',
			minWidth: 120,
			dict: options.documentType
		},
		{
			label: t('名称'),
			prop: 'name',
			minWidth: 140,
			dict: options.documentName
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
		service: service.intellectual.softCopyrightDocument
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
