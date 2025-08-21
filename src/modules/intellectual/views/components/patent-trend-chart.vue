<template>
	<div class="card">
		<div class="card__header">
			<span class="title">{{ $t('专利年度趋势') }}</span>
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

const { t } = useI18n();
const isDark = useDark();
const theme = useTheme();

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
			show: true,
			lineStyle: {
				color: 'rgba(150,150,150,0.1)'
			}
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
			let result = `${comp[0].name}年<br/>`;
			comp.forEach((item: any) => {
				result += `${item.seriesName}：${item.value || 0}<br/>`;
			});
			return result;
		},
		axisPointer: {
			show: true,
			type: 'line',
			lineStyle: {
				color: 'rgba(150,150,150,0.3)',
				width: 1,
				type: 'dashed'
			}
		}
	},
	legend: {
		data: ['已授权专利', '申请的专利'],
		top: '10%'
	},
	series: [
		{
			name: '已授权专利',
			type: 'line',
			data: [] as number[],
			smooth: true,
			lineStyle: {
				width: 3,
				color: '#67C23A'
			},
			itemStyle: {
				color: '#67C23A',
				borderWidth: 2,
				borderColor: '#fff'
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
						{ offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
					]
				}
			}
		},
		{
			name: '申请的专利',
			type: 'line',
			data: [] as number[],
			smooth: true,
			lineStyle: {
				width: 3,
				color: '#409EFF'
			},
			itemStyle: {
				color: '#409EFF',
				borderWidth: 2,
				borderColor: '#fff'
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
						{ offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
					]
				}
			}
		}
	]
});

const color = computed(() => {
	return isDark.value ? theme.color : '#409eff';
});

// 获取专利年度趋势数据
const getPatentTrendData = async () => {
	try {
		// 获取所有专利数据
		const res = await service.intellectual.patent.page({
			page: 1,
			size: 10000
		});
		
		const patents = res.list || [];
		const currentYear = new Date().getFullYear();
		
		// 生成近5年的年份数组
		const years: number[] = [];
		for (let i = 4; i >= 0; i--) {
			years.push(currentYear - i);
		}
		
		// 统计各年份的专利数量（按申请日年份）
		const yearStats: { [key: number]: { granted: number; applying: number } } = {};
		
		// 初始化统计对象
		years.forEach(year => {
			yearStats[year] = { granted: 0, applying: 0 };
		});
		
		// 统计数据
		patents.forEach(patent => {
			// 已授权专利按证书日期年份统计
			if (patent.legalStatus === 2 && patent.certificateDate) {
				const year = new Date(patent.certificateDate).getFullYear();
				if (yearStats[year]) {
					yearStats[year].granted++;
				}
			}
			
			// 申请的专利按申请日期年份统计
			if (patent.applicationDate) {
				const year = new Date(patent.applicationDate).getFullYear();
				if (yearStats[year]) {
					yearStats[year].applying++;
				}
			}
		});
		
		// 准备图表数据
		const yearLabels = years.map(year => year.toString());
		const grantedData = years.map(year => yearStats[year].granted);
		const applyingData = years.map(year => yearStats[year].applying);
		
		chartOption.xAxis.data = yearLabels;
		chartOption.series[0].data = grantedData;
		chartOption.series[1].data = applyingData;
		
	} catch (error) {
		console.error('获取专利年度趋势数据失败:', error);
	}
};

function refresh() {
	getPatentTrendData();
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