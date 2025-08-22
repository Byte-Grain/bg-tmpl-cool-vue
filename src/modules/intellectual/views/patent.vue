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
		name: 'intellectual-patent'
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
</script>
