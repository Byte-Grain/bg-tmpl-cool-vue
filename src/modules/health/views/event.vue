<template>
	<cl-view-group ref="ViewGroup">
		<template #item-name="{ item }"> {{ item.name }} - {{ item.key }} </template>

		<template #right>
			<cl-crud ref="Crud">
				<cl-row>
					<!-- 刷新按钮 -->
					<cl-refresh-btn />
					<!-- 新增按钮 -->
					<cl-add-btn />
					<!-- 批量删除 -->
					<cl-multi-delete-btn />
					<cl-flex1 />
					<!-- 关键字搜索 -->
					<cl-search-key :placeholder="$t('搜索名称')" />
				</cl-row>

				<cl-row>
					<!-- 数据表格 -->
					<cl-table ref="Table">
						<template #column-type="{ scope }">
							<el-tag v-if="scope.row.type" :type="scope.row.type" size="small">
							</el-tag>
						</template>
						<template #column-color="{ scope }">
							<div v-if="scope.row.color" :style="{
								width: '20px',
								height: '20px',
								backgroundColor: scope.row.color,
								border: '1px solid #ddd',
								borderRadius: '4px',
								display: 'inline-block'
							}"></div>
						</template>
					</cl-table>
				</cl-row>

				<cl-row>
					<cl-flex1 />
				</cl-row>

				<!-- 新增、编辑 -->
				<cl-upsert ref="Upsert">
					<template #slot-value="{ scope }">
						<div>
							<el-input v-model="scope.value" :placeholder="$t('请填写值')" clearable type="textarea"
								:rows="4" class="mb-2" />
						</div>
					</template>
				</cl-upsert>
			</cl-crud>
		</template>
	</cl-view-group>
</template>

<script lang="ts" setup>
	defineOptions({
		name: 'dict-list'
	});

	import { useCrud, useTable, useUpsert } from '@cool-vue/crud';
	import { useCool } from '/@/cool';
	import { useViewGroup } from '/@/plugins/view';
	import { useI18n } from 'vue-i18n';
	import { Plugins } from '/#/crud';
	import { generateRandomColor } from '../utils';

	const { service } = useCool();
	const { t } = useI18n();

	const { ViewGroup } = useViewGroup({
		label: t('分组'),
		title: t('事件标记分组'),
		service: service.health.eventGroup,
		onSelect(item) {
			refresh({
				groupId: item.id,
				page: 1,
				prop: 'orderNum',
				order: 'desc'
			});
		},
		onEdit() {
			return {
				width: '500px',
				props: {
					labelWidth: '60px'
				},
				items: [
					{
						label: t('名称'),
						prop: 'name',
						component: {
							name: 'el-input',
							props: {
								maxlength: 20
							}
						},
						required: true
					}
				]
			};
		}
	});

	// cl-upsert
	const Upsert = useUpsert({
		dialog: {
			width: '600px'
		},
		props: {
			labelWidth: '100px'
		},
		items: [
			{
				label: t('名称'),
				prop: 'name',
				required: true,
				component: { name: 'el-input' }
			},
			{
				label: t('颜色'),
				prop: 'color',
				required: true,
				component: {
					name: 'el-color-picker',
					props: {
						showAlpha: false,
						colorFormat: 'hex',
						size: 'default'
					}
				}
			},
			{
				label: t('排序'),
				prop: 'orderNum',
				value: 1,
				component: { name: 'el-input-number', props: { min: 1 } }
			},
			{
				label: t('备注'),
				prop: 'remark',
				component: {
					name: 'el-input',
					props: { type: 'textarea', rows: 4 }
				}
			}
		],
		onSubmit(data, { next }) {
			next({
				...data,
				groupId: ViewGroup.value?.selected?.id,
				// 确保type和color字段为空时传递空字符串而不是null或undefined
				type: data.type || '',
				color: data.color || ''
			});
		},
		plugins: [Plugins.Form.setFocus('name')]
	});

	// cl-table
	const Table = useTable({
		contextMenu: [
			'refresh',
			row => {
				return {
					label: t('新增'),
					hidden: !service.health.eventGroup._permission?.add,
					callback(done) {
						append(row);
						done();
					}
				};
			},
			'edit',
			'delete',
			'order-asc',
			'order-desc'
		],
		columns: [
			{
				type: 'selection'
			},
			{ label: t('事件名称'), prop: 'name', align: 'left', minWidth: 200 },
			{
				label: t('颜色'),
				prop: 'color',
				width: 100
			},
			{
				label: t('备注'),
				prop: 'remark',
				showOverflowTooltip: true,
				minWidth: 170
			},
			{
				label: t('排序'),
				prop: 'orderNum',
				sortable: 'desc',
				width: 100,
				fixed: 'right'
			},
			{
				label: t('创建时间'),
				prop: 'createTime',
				sortable: 'custom',
				minWidth: 170
			},
			{
				label: t('更新时间'),
				prop: 'updateTime',
				sortable: 'custom',
				minWidth: 170
			},
			{
				type: 'op',
				width: 250,
				buttons: [
					{
						label: t('新增'),
						type: 'success',
						hidden: !service.health.eventTag._permission.add,
						onClick({ scope }) {
							append(scope.row);
						}
					},
					'edit',
					'delete'
				]
			}
		],
		plugins: [Plugins.Table.toTree()]
	});

	// cl-crud
	const Crud = useCrud({
		service: service.health.eventTag,
		onRefresh(params, { render }) {
			service.health.eventTag.list(params).then(res => {
				render(res);
			});
		}
	});

	// 刷新
	function refresh(params?: any) {
		Crud.value?.refresh(params);
	}

	// 追加子集
	function append(row: any) {
		Crud.value?.rowAppend({
			groupId: row.id,
			orderNum: 1
		});
	}
</script>
