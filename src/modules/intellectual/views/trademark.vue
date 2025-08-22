<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<!-- Excel导入按钮 -->
			<cl-import-btn
				template="/商标导入模版.csv"
				:on-submit="onImportSubmit"
				tips="请按照模板格式填写商标数据"
			/>
			<!-- Excel导出按钮 -->
			<cl-export-btn
				:columns="exportColumns"
				:filename="`商标数据_${new Date().toISOString().split('T')[0]}`"
			/>
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
import { ElMessage } from 'element-plus';

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
		console.error(t('加载机构数据失败'), error);
	}
}

// 获取字典数据
const getDictData = async () => {
	const dictTypes = ['intellectual_trademark_type', 'intellectual_legal_status'];

	// 使用字典store刷新数据
	await dict.refresh(dictTypes);

	console.log(t('商标字典数据加载'), {
		trademarkType: dict.get('intellectual_trademark_type').value,
		legalStatus: dict.get('intellectual_legal_status').value
	});
};

// 组件挂载时加载数据
onMounted(async () => {
	await getDictData();
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
				props: { clearable: true, placeholder: t('请选择类型') }
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
				props: { clearable: true, placeholder: t('请选择分类号') }
			},
			span: 12
		},
		{
			label: t('来源'),
			prop: 'source',
			component: {
				name: 'el-select',
				options: dict.get('intellectual_trademark_source'),
				props: { clearable: true, placeholder: t('请选择来源') }
			},
			span: 12
		},
		{
			label: t('法律状态'),
			prop: 'legalStatus',
			component: {
				name: 'el-select',
				options: dict.get('intellectual_legal_status'),
				props: { clearable: true, placeholder: t('请选择法律状态') }
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
		}, // 图片上传
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
			dict: dict.get('intellectual_legal_status')
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

// Excel导入处理函数
const onImportSubmit = async (data: any[]) => {
	try {
		// 创建字典值映射
		const trademarkTypeMap = new Map<string, number>();
		dict.get('intellectual_trademark_type').value.forEach((item: any) => {
			trademarkTypeMap.set(item.label, item.value);
		});

		const trademarkSourceMap = new Map<string, number>();
		dict.get('intellectual_trademark_source').value.forEach((item: any) => {
			trademarkSourceMap.set(item.label, item.value);
		});

		const trademarkClassificationMap = new Map<string, number>();
		dict.get('intellectual_trademark_classification').value.forEach((item: any) => {
			trademarkClassificationMap.set(item.label, item.value);
		});

		const legalStatusMap = new Map<string, number>();
		dict.get('intellectual_legal_status').value.forEach((item: any) => {
			legalStatusMap.set(item.label, item.value);
		});

		const validData: any[] = [];
		const errors: string[] = [];

		data.forEach((row: any, index: number) => {
			// 验证必填字段
			if (
				!row.registrationNumber ||
				!row.name ||
				!row.type ||
				!row.legalStatus ||
				!row.registrant
			) {
				errors.push(`第${index + 1}行：注册号、名称、类型、法律状态、注册人为必填项`);
				return;
			}

			// 转换数据
			const transformedRow = {
				...row,
				type: trademarkTypeMap.get(row.type) ?? row.type,
				source: trademarkSourceMap.get(row.source) ?? row.source,
				classificationNumber:
					trademarkClassificationMap.get(row.classificationNumber) ??
					row.classificationNumber,
				legalStatus: legalStatusMap.get(row.legalStatus) ?? row.legalStatus
			};

			validData.push(transformedRow);
		});

		if (errors.length > 0) {
			ElMessage.error(`导入失败：${errors.join('; ')}`);
			return;
		}

		// 批量添加数据
		for (const item of validData) {
			await service.intellectual.trademark.add(item);
		}

		ElMessage.success(`成功导入 ${validData.length} 条商标数据`);
		refresh();
	} catch (error) {
		console.error('导入商标数据失败:', error);
		ElMessage.error('导入失败，请检查数据格式');
	}
};

// 导出列配置
const exportColumns = computed(() => [
	{ label: '注册号', prop: 'registrationNumber' },
	{ label: '商标名称', prop: 'name' },
	{
		label: '类型',
		prop: 'type',
		dict: dict.get('intellectual_trademark_type').value
	},
	{
		label: '来源',
		prop: 'source',
		dict: dict.get('intellectual_trademark_source').value
	},
	{
		label: '分类号',
		prop: 'classificationNumber',
		dict: dict.get('intellectual_trademark_classification').value
	},
	{ label: '注册人', prop: 'registrant' },
	{ label: '代理机构', prop: 'agency' },
	{ label: '申请日', prop: 'applicationDate' },
	{ label: '注册生效日', prop: 'registrationEffectiveDate' },
	{ label: '有效期', prop: 'validityPeriod' },
	{ label: '申请服务内容', prop: 'applicationServiceContent' },
	{ label: '核定使用商品/服务项目', prop: 'approvedGoodsServices' },
	{
		label: '法律状态',
		prop: 'legalStatus',
		dict: dict.get('intellectual_legal_status').value
	},
	{ label: '备注', prop: 'remark' }
]);
</script>
