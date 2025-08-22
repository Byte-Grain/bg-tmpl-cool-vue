<template>
	<cl-crud ref="Crud">
		<cl-row>
			<!-- 刷新按钮 -->
			<cl-refresh-btn />
			<!-- 新增按钮 -->
			<cl-add-btn />
			<!-- 删除按钮 -->
			<cl-multi-delete-btn />
			<!-- Excel导入 -->
			<cl-import-btn
				template="/专利导入模版.xlsx"
				:on-submit="onImportSubmit"
				:tips="t('请按照模版填写专利信息，确保必填字段完整')"
			/>
			<!-- Excel导出 -->
			<cl-export-btn
				:columns="exportColumns"
				:filename="`专利数据_${new Date().toISOString().slice(0, 10)}`"
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
	name: 'intellectual-patent'
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
		if (res && res.length > 0) {
			// 过滤权利人类型的机构
			options.patenteeOptions = res
				.filter((item: any) => item.type === 1) // 权利人类型为1
				.map((item: any) => ({
					label: item.name,
					value: item.name
				}));
			// 过滤代理机构类型的机构
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
	const dictTypes = ['intellectual_patent_type', 'intellectual_legal_status'];

	// 使用字典store刷新数据
	await dict.refresh(dictTypes);

	console.log(t('专利字典数据加载'), {
		patentType: dict.get('intellectual_patent_type').value,
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
	patenteeOptions: [] as Array<{ label: string; value: string }>,
	agencyOptions: [] as Array<{ label: string; value: string }>
});

// cl-upsert
const Upsert = useUpsert({
	items: [
		{
			label: t('名称'),
			prop: 'name',
			component: {
				name: 'el-input',
				props: { clearable: true, placeholder: t('请输入专利名称') }
			},
			span: 24,
			required: true
		},
		{
			label: t('案号'),
			prop: 'caseNumber',
			component: {
				name: 'el-input',
				props: { clearable: true, placeholder: t('请输入案号') }
			},
			span: 12
		},
		{
			label: t('专利号'),
			prop: 'patentNumber',
			component: {
				name: 'el-input',
				props: { clearable: true, placeholder: t('请输入专利号') }
			},
			span: 12
		},
		{
			label: t('证书号'),
			prop: 'certificateNumber',
			component: {
				name: 'el-input',
				props: { clearable: true, placeholder: t('请输入证书号') }
			},
			span: 12
		},
		{
			label: t('授权公告号'),
			prop: 'authorizationAnnouncementNumber',
			component: {
				name: 'el-input',
				props: { clearable: true, placeholder: t('请输入授权公告号') }
			},
			span: 12
		},
		{
			label: t('申请日'),
			prop: 'applicationDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD', placeholder: t('请选择申请日期') }
			},
			span: 12
		},
		{
			label: t('证书日'),
			prop: 'certificateDate',
			component: {
				name: 'el-date-picker',
				props: { type: 'date', valueFormat: 'YYYY-MM-DD', placeholder: t('请选择证书日期') }
			},
			span: 12
		},
		{
			label: t('专利权利人'),
			prop: 'patentee',
			component: {
				name: 'el-select',
				props: { clearable: true, filterable: true, placeholder: t('请选择专利权利人') },
				options: computed(() => options.patenteeOptions)
			},
			span: 24
		},
		{
			label: t('专利类型'),
			prop: 'patentType',
			component: {
				name: 'el-select',
				options: dict.get('intellectual_patent_type'),
				props: { clearable: true, placeholder: t('请选择专利类型') }
			},
			value: 0,
			required: true,
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
			value: 0,
			required: true,
			span: 12
		},
		{
			label: t('发明人'),
			prop: 'inventor',
			component: {
				name: 'el-input',
				props: { clearable: true, placeholder: t('请输入发明人姓名，多个发明人用逗号分隔') }
			},
			span: 12
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
		{
			label: t('专利级别'),
			prop: 'patentLevel',
			component: {
				name: 'el-select',
				props: { clearable: true, placeholder: t('请选择专利级别') },
				options: dict.get('intellectual_patent_level')
			},
			span: 24
		},
		{
			label: t('权力要求'),
			prop: 'claimsRequirement',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 4,
					clearable: true,
					placeholder: t('请输入权力要求')
				}
			},
			span: 24
		},
		{
			label: t('备注'),
			prop: 'remark',
			component: {
				name: 'el-input',
				props: {
					type: 'textarea',
					rows: 3,
					clearable: true,
					placeholder: t('请输入备注')
				}
			},
			span: 24
		}
	]
});

// cl-table
const Table = useTable({
	columns: [
		{ type: 'selection' },
		{ label: t('案号'), prop: 'caseNumber', minWidth: 100 },
		{ label: t('专利号'), prop: 'patentNumber', minWidth: 140 },
		{ label: t('名称'), prop: 'name', minWidth: 200 },
		{
			label: t('专利类型'),
			prop: 'patentType',
			minWidth: 120,
			dict: dict.get('intellectual_patent_type'),
			dictColor: true
		},
		{
			label: t('专利级别'),
			prop: 'patentLevel',
			minWidth: 120,
			dict: dict.get('intellectual_patent_level'),
			dictColor: true
		},
		{
			label: t('法律状态'),
			prop: 'legalStatus',
			minWidth: 120,
			dict: dict.get('intellectual_legal_status'),
			dictColor: true
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
			label: t('证书日'),
			prop: 'certificateDate',
			minWidth: 140,
			sortable: 'custom',
			component: {
				name: 'cl-date-text',
				props: { format: 'YYYY-MM-DD' }
			}
		},
		{ label: t('专利权利人'), prop: 'patentee', minWidth: 140 },
		{ label: t('发明人'), prop: 'inventor', minWidth: 140 },
		{ label: t('证书号'), prop: 'certificateNumber', minWidth: 140 },
		{
			label: t('授权公告号'),
			prop: 'authorizationAnnouncementNumber',
			minWidth: 140
		},
		{ label: t('代理机构'), prop: 'agency', minWidth: 140 },
		{
			hidden: true,
			label: t('创建时间'),
			prop: 'createTime',
			minWidth: 170,
			sortable: 'desc',
			component: { name: 'cl-date-text' }
		},
		{
			hidden: true,
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
		service: service.intellectual.patent
	},
	app => {
		app.refresh();
	}
);

// 刷新
function refresh(params?: any) {
	Crud.value?.refresh(params);
}

// 导出列配置
const exportColumns = computed(() => [
	{ label: '专利名称', prop: 'name' },
	{ label: '案号', prop: 'caseNumber' },
	{ label: '专利号', prop: 'patentNumber' },
	{ label: '证书号', prop: 'certificateNumber' },
	{ label: '授权公告号', prop: 'authorizationAnnouncementNumber' },
	{ label: '申请日', prop: 'applicationDate' },
	{ label: '证书日', prop: 'certificateDate' },
	{ label: '专利权利人', prop: 'patentee' },
	{
		label: '专利类型',
		prop: 'patentType',
		dict: dict.get('intellectual_patent_type').value
	},
	{
		label: '法律状态',
		prop: 'legalStatus',
		dict: dict.get('intellectual_legal_status').value
	},
	{ label: '发明人', prop: 'inventor' },
	{ label: '代理机构', prop: 'agency' },
	{
		label: '专利级别',
		prop: 'patentLevel',
		dict: dict.get('intellectual_patent_level').value
	},
	{ label: '权力要求', prop: 'claimsRequirement' },
	{ label: '备注', prop: 'remark' }
]);

// Excel导入处理
function onImportSubmit(data: { list: any[]; file: File }, { done, close }: any) {
	// 获取字典数据
	const patentTypeDict = dict.get('intellectual_patent_type').value;
	const legalStatusDict = dict.get('intellectual_legal_status').value;
	const patentLevelDict = dict.get('intellectual_patent_level').value;

	// 创建字典映射
	const patentTypeMap = new Map<string, any>();
	const legalStatusMap = new Map<string, any>();
	const patentLevelMap = new Map<string, any>();

	// 构建字典映射关系
	patentTypeDict.forEach((item: any) => {
		patentTypeMap.set(item.label, item.value);
	});
	legalStatusDict.forEach((item: any) => {
		legalStatusMap.set(item.label, item.value);
	});
	patentLevelDict.forEach((item: any) => {
		patentLevelMap.set(item.label, item.value);
	});

	// 数据验证和处理
	const validData: any[] = [];
	const errors: string[] = [];

	data.list.forEach((item: any, index: number) => {
		// 跳过空行和说明行
		if (
			!item['专利名称'] ||
			item['专利名称'].includes('填写说明') ||
			item['专利名称'].includes('专利名称')
		) {
			return;
		}

		// 验证必填字段
		if (!item['专利名称']) {
			errors.push(`第${index + 1}行：专利名称不能为空`);
			return;
		}
		if (!item['专利类型']) {
			errors.push(`第${index + 1}行：专利类型不能为空`);
			return;
		}
		if (!item['法律状态']) {
			errors.push(`第${index + 1}行：法律状态不能为空`);
			return;
		}

		// 转换字典值
		const patentType = patentTypeMap.get(item['专利类型']);
		const legalStatus = legalStatusMap.get(item['法律状态']);
		const patentLevel = patentLevelMap.get(item['专利级别']);

		if (patentType === undefined) {
			errors.push(`第${index + 1}行：专利类型"${item['专利类型']}"不在字典中`);
			return;
		}
		if (legalStatus === undefined) {
			errors.push(`第${index + 1}行：法律状态"${item['法律状态']}"不在字典中`);
			return;
		}

		// 构建数据对象
		const processedItem = {
			name: item['专利名称'],
			caseNumber: item['案号'] || '',
			patentNumber: item['专利号'] || '',
			certificateNumber: item['证书号'] || '',
			authorizationAnnouncementNumber: item['授权公告号'] || '',
			applicationDate: item['申请日'] || null,
			certificateDate: item['证书日'] || null,
			patentee: item['专利权利人'] || '',
			patentType: patentType,
			legalStatus: legalStatus,
			inventor: item['发明人'] || '',
			agency: item['代理机构'] || '',
			patentLevel: patentLevel || null,
			claimsRequirement: item['权力要求'] || '',
			remark: item['备注'] || ''
		};

		validData.push(processedItem);
	});

	// 显示错误信息
	if (errors.length > 0) {
		ElMessage.error(
			`数据验证失败：\n${errors.slice(0, 5).join('\n')}${errors.length > 5 ? '\n...' : ''}`
		);
		return;
	}

	if (validData.length === 0) {
		ElMessage.error(t('没有有效的数据可以导入，请检查数据格式'));
		return;
	}

	// 批量导入数据
	service.intellectual.patent
		.add(validData)
		.then(() => {
			ElMessage.success(t('成功导入 {count} 条专利数据', { count: validData.length }));
			close();
			refresh();
		})
		.catch((err: any) => {
			ElMessage.error(t('导入失败: {message}', { message: err.message }));
		});
}
</script>
