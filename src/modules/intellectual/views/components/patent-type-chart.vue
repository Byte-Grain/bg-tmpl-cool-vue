<template>
	<div class="card">
		<div class="card__header">
			<span class="title">{{ $t('专利类型分布') }}</span>
		</div>

		<v-chart :option="chartOption" autoresize />
	</div>
</template>

<script lang="ts" setup>
	import { computed, onMounted, reactive } from 'vue';
	import { useDark } from '@vueuse/core';
	import { useI18n } from 'vue-i18n';
	import { useTheme } from '/#/theme';
	import { service } from '/@/cool';
	import { useDict } from '/$/dict';

	const { t } = useI18n();
	const isDark = useDark();
	const theme = useTheme();
	const { dict } = useDict();

	const chartOption = reactive({
		grid: {
			containLabel: true,
			left: '5%',
			right: '5%'
		},
		xAxis: {
			type: 'category',
			data: [] as string[],
			offset: 5,
			axisLine: {
				show: false
			},
			axisTick: {
				show: false
			}
		},
		yAxis: {
			type: 'value',
			offset: 20,
			splitLine: {
				show: false
			},
			axisTick: {
				show: false
			},
			axisLine: {
				show: false
			}
		},
		tooltip: {
			trigger: 'axis',
			formatter: (comp: any) => {
				const data = comp[0];
				return `${data.name}：${data.value || 0}`;
			},
			axisPointer: {
				show: true,
				status: 'shadow',
				z: -1,
				type: 'shadow',
				shadowStyle: {
					color: 'rgba(150,150,150,0.1)'
				}
			}
		},
		legend: {
			data: ['已授权', '申请中'],
			top: '10%'
		},
		series: [
			{
				name: '已授权',
				type: 'bar',
				data: [] as number[],
				barWidth: '30%',
				itemStyle: {
					borderRadius: [4, 4, 0, 0],
					color: '#67C23A'
				}
			},
			{
				name: '申请中',
				type: 'bar',
				data: [] as number[],
				barWidth: '30%',
				itemStyle: {
					borderRadius: [4, 4, 0, 0],
					color: '#409EFF'
				}
			}
		]
	});

	const color = computed(() => {
		return isDark.value ? theme.color : '#409eff';
	});

	// 获取专利类型统计数据
	const getPatentTypeData = async () => {
		try {
			// 获取所有专利数据
			const res = await service.intellectual.patent.page({
				page: 1,
				size: 10000
			});

			const patents = res.list || [];

			// 从字典获取专利类型映射
			const patentTypeDict = dict.get('intellectual_patent_type')?.value || [];
			const typeMap: { [key: number]: string } = {};

			// 构建类型映射
			patentTypeDict.forEach((item: any) => {
				typeMap[parseInt(item.value)] = item.label;
			});

			// 统计各类型的已授权和申请中专利数量
			const typeStats: { [key: string]: { granted: number; applying: number } } = {};

			// 初始化统计对象
			Object.values(typeMap).forEach(typeName => {
				typeStats[typeName] = { granted: 0, applying: 0 };
			});

			// 统计数据
			console.log('专利数据:', patents);
			console.log('专利类型映射:', typeMap);

			patents.forEach(patent => {
				console.log('处理专利:', patent.name, 'patentType:', patent.patentType, 'legalStatus:', patent.legalStatus);
				// 只统计在字典中存在的专利类型
				if (patent.patentType !== undefined && typeMap[patent.patentType]) {
					const typeName = typeMap[patent.patentType];
					console.log('匹配到专利类型:', typeName);

					if (patent.legalStatus === 2) {
						// 已授权
						typeStats[typeName].granted++;
						console.log('已授权专利+1:', typeName);
					} else if (patent.legalStatus && [1, 5, 6].includes(patent.legalStatus)) {
						// 申请中
						typeStats[typeName].applying++;
						console.log('申请中专利+1:', typeName);
					}
				} else {
					console.log('专利类型不匹配:', patent.patentType, '可用类型:', Object.keys(typeMap));
				}
			});

			console.log('最终统计结果:', typeStats);

			// 准备图表数据
			const categories = Object.keys(typeStats);
			const grantedData = categories.map(type => typeStats[type].granted);
			const applyingData = categories.map(type => typeStats[type].applying);

			chartOption.xAxis.data = categories;
			chartOption.series[0].data = grantedData;
			chartOption.series[1].data = applyingData;

		} catch (error) {
			console.error('获取专利类型统计数据失败:', error);
		}
	};

	function refresh() {
		getPatentTypeData();
	}

	onMounted(() => {
		refresh();
	});
</script>

<style lang="scss" scoped>
	.card {
		height: 400px;

		&__header {
			.title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
			}
		}
	}
</style>
