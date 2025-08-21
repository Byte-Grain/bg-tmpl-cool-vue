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

interface ChartData {
	category: string;
	values: number[];
}

interface Props {
	title: string;
	data: ChartData[];
	legendData: string[];
	colors?: string[];
	height?: number;
}

const props = withDefaults(defineProps<Props>(), {
	colors: () => ['#67C23A', '#409EFF'],
	height: 400
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
		data: [] as string[],
		top: '10%'
	},
	series: [] as any[]
});

const color = computed(() => {
	return isDark.value ? theme.color : '#409eff';
});

// 更新图表数据
const updateChart = () => {
	if (!props.data || props.data.length === 0) {
		return;
	}

	// 设置分类数据
	chartOption.xAxis.data = props.data.map(item => item.category);

	// 设置图例数据
	chartOption.legend.data = props.legendData;

	// 设置系列数据
	chartOption.series = props.legendData.map((name, index) => ({
		name,
		type: 'bar',
		data: props.data.map(item => item.values[index] || 0),
		barWidth: '30%',
		itemStyle: {
			borderRadius: [4, 4, 0, 0],
			color: props.colors[index] || '#409EFF'
		}
	}));
};

// 监听数据变化
watch(
	() => [props.data, props.legendData],
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
