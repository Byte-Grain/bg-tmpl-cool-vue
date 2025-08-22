<template>
	<div class="card">
		<div class="card__header">
			<span class="title">{{ title }}</span>
		</div>

		<v-chart :option="chartOption" autoresize />
	</div>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from 'vue';
import { useDark } from '@vueuse/core';
import { useTheme } from '/#/theme';

interface TrendData {
	year: string;
	values: number[];
}

interface SeriesConfig {
	name: string;
	color: string;
	areaColor?: string;
}

interface Props {
	title: string;
	data: TrendData[];
	seriesConfig: SeriesConfig[];
	height?: number;
	smooth?: boolean;
	showArea?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	height: 400,
	smooth: true,
	showArea: true
});

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
		minInterval: 1,
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
		data: [] as string[],
		top: 10
	},
	series: [] as any[]
});

const color = computed(() => {
	return isDark.value ? theme.color : '#409eff';
});

// 生成渐变色配置
const generateAreaStyle = (color: string, areaColor?: string) => {
	if (!props.showArea) return undefined;

	const baseColor = areaColor || color;
	// 从颜色字符串中提取RGB值
	let rgb = '';
	if (baseColor.startsWith('#')) {
		const hex = baseColor.slice(1);
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		rgb = `${r}, ${g}, ${b}`;
	} else if (baseColor.startsWith('rgb')) {
		rgb = baseColor.match(/\d+/g)?.join(', ') || '64, 158, 255';
	} else {
		rgb = '64, 158, 255'; // 默认蓝色
	}

	return {
		color: {
			type: 'linear',
			x: 0,
			y: 0,
			x2: 0,
			y2: 1,
			colorStops: [
				{ offset: 0, color: `rgba(${rgb}, 0.3)` },
				{ offset: 1, color: `rgba(${rgb}, 0.05)` }
			]
		}
	};
};

// 更新图表数据
const updateChart = () => {
	if (
		!props.data ||
		props.data.length === 0 ||
		!props.seriesConfig ||
		props.seriesConfig.length === 0
	) {
		return;
	}

	// 设置年份数据
	chartOption.xAxis.data = props.data.map(item => item.year);

	// 设置图例数据
	chartOption.legend.data = props.seriesConfig.map(config => config.name);

	// 设置系列数据
	chartOption.series = props.seriesConfig.map((config, index) => ({
		name: config.name,
		type: 'line',
		data: props.data.map(item => item.values[index] || 0),
		smooth: props.smooth,
		lineStyle: {
			width: 3,
			color: config.color
		},
		itemStyle: {
			color: config.color,
			borderWidth: 2,
			borderColor: '#fff'
		},
		areaStyle: generateAreaStyle(config.color, config.areaColor)
	}));
};

// 监听数据变化
watch(
	() => [props.data, props.seriesConfig, props.smooth, props.showArea],
	() => {
		updateChart();
	},
	{ immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.card {
	height: v-bind('props.height + "px"');

	&__header {
		.title {
			font-size: 16px;
			font-weight: 600;
			color: var(--el-text-color-primary);
		}
	}
}
</style>
