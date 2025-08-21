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

	import { reactive, onMounted, computed } from 'vue';
	import { useUpsert, useCrud, useTable, useSearch } from '@cool-vue/crud';
	import { useCool } from '/@/cool';
	import { useI18n } from 'vue-i18n';
	import { useDict } from '/$/dict';

	const { service } = useCool();
	const { t } = useI18n();
	const { dict } = useDict();

	// 响应式字典数据
	const categoryOptions = computed(() => dict.get('intellectual_software_category').value || []);
	const developmentMethodOptions = computed(() => dict.get('intellectual_development_method').value || []);
	const acquisitionMethodOptions = computed(() => dict.get('intellectual_acquisition_method').value || []);
	const scopeOfRightOptions = computed(() => dict.get('intellectual_scope_of_right').value || []);
	const legalStatusOptions = computed(() => dict.get('intellectual_unified_legal_status').value || []);

	// 加载机构数据
	async function loadOrganizations() {
		try {
			const res = await service.intellectual.organization.list();
			if (res && res.length > 0) {
				// 过滤权利人类型的机构
				options.rightHolderOptions = res
					.filter((item: any) => item.type === 1) // 权利人类型为1
					.map((item: any) => ({
						label: item.name,
						value: item.name
					}));
			}
		} catch (error) {
			console.error('加载机构数据失败:', error);
		}
	}

	// 选项
	const options = reactive({
		rightHolderOptions: [] as Array<{ label: string; value: string }>
	});

	// 获取字典数据
	const getDictData = async () => {
		const dictTypes = [
			'intellectual_software_category',
			'intellectual_development_method',
			'intellectual_acquisition_method',
			'intellectual_scope_of_right',
			'intellectual_unified_legal_status'
		];

		// 使用字典store刷新数据
		await dict.refresh(dictTypes);

		console.log('软著字典数据加载:', {
			category: categoryOptions.value,
			developmentMethod: developmentMethodOptions.value,
			acquisitionMethod: acquisitionMethodOptions.value,
			scopeOfRight: scopeOfRightOptions.value,
			legalStatus: legalStatusOptions.value
		});
	};

	// 初始化字典数据和机构数据
	onMounted(async () => {
		await getDictData();
		await loadOrganizations();
	});

	// cl-upsert
	const Upsert = useUpsert({
		items: [
			// 基本信息
			{
				label: t('名称'),
				prop: 'name',
				component: { name: 'el-input', props: { clearable: true } },
				span: 24,
				required: true
			},
			{
				label: t('版本'),
				prop: 'version',
				component: { name: 'el-input', props: { clearable: true } },
				value: 'V1.0',
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
				component: {
					name: 'el-select',
					options: categoryOptions,
					props: { clearable: true, placeholder: '请选择分类' }
				},
				value: 0,
				span: 12,
				required: true
			},
			{
				label: t('开发方式'),
				prop: 'developmentMethod',
				component: {
					name: 'el-select',
					options: developmentMethodOptions,
					props: { clearable: true }
				},
				value: 0,
				span: 12
			},
			// 权利信息
			{
				label: t('取得方式'),
				prop: 'acquisitionMethod',
				component: {
					name: 'el-select',
					options: acquisitionMethodOptions,
					props: { clearable: true, placeholder: '请选择取得方式' }
				},
				value: 0,
				span: 12
			},
			{
				label: t('权利范围'),
				prop: 'scopeOfRight',
				component: {
					name: 'el-select',
					options: scopeOfRightOptions,
					props: { clearable: true, placeholder: '请选择权利范围' }
				},
				value: 0,
				span: 12
			},
			// 编号信息
			{
				label: t('流水号'),
				prop: 'serialNumber',
				component: { name: 'el-input', props: { clearable: true } },
				span: 24
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
				label: t('证书日'),
				prop: 'certificateDate',
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
					options: legalStatusOptions,
					props: { clearable: true }
				},
				value: 0,
				span: 24,
				required: true
			},

			// 人员信息
			{
				label: t('权利人'),
				prop: 'rightHolder',
				component: {
					name: 'el-select',
					props: { clearable: true, filterable: true, placeholder: t('请选择权利人') },
					options: computed(() => options.rightHolderOptions)
				},
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
				dict: computed(() => categoryOptions.value)
			},
			{ label: t('流水号'), prop: 'serialNumber', minWidth: 140 },
			{ label: t('登记号'), prop: 'registrationNumber', minWidth: 140 },
			{ label: t('证书号'), prop: 'certificateNumber', minWidth: 140 },
			{
				label: t('开发方式'),
				prop: 'developmentMethod',
				minWidth: 120,
				dict: computed(() => developmentMethodOptions.value)
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
				label: t('证书日'),
				prop: 'certificateDate',
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
				dict: computed(() => acquisitionMethodOptions.value)
			},
			{ label: t('权利人'), prop: 'rightHolder', minWidth: 140 },
			{
				label: t('权利范围'),
				prop: 'scopeOfRight',
				minWidth: 120,
				dict: computed(() => scopeOfRightOptions.value)
			},
			{ label: t('申请人'), prop: 'applicant', minWidth: 140 },
			{
				label: t('法律状态'),
				prop: 'legalStatus',
				minWidth: 120,
				dict: computed(() => legalStatusOptions.value)
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
