<template>
	<div class="card">
		<div class="card__header">
			<cl-select-button v-model="tab.active" :options="tab.list" @change="onChange" />

			<span class="year">{{ $t('{year}年软著统计', { year: dayjs().year() }) }}</span>
		</div>

		<v-chart :option="chartOption" autoresize />
	</div>
</template>

<script lang="ts" setup>
import { range } from 'lodash-es';
import { computed, onMounted, reactive } from 'vue';
import dayjs from 'dayjs';
import { useDark } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useTheme } from '/#/theme';

const { t } = useI18n();
const isDark = useDark();
const theme = useTheme();

const tab = reactive({
	active: 'granted',

	list: [
		{
			label: t('已授权软著'),
			value: 'granted'
		},
		{
			label: t('申请中软著'),
			value: 'applying'
		}
	]
});

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
			const name = tab.list.find(e => e.value === tab.active)?.label;

			return `${name}：${comp[0]?.value || 0}`;
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
	series: [
		{
			type: 'line',
			data: [] as number[],
			smooth: true,
			lineStyle: {
				width: 3
			},
			itemStyle: {
				borderRadius: 4
			}
		}
	]
});

const color = computed(() => {
	return isDark.value ? theme.color : '#67c23a';
});

function refresh() {
	// 生成12个月的数据
	const months = range(1, 13).map(i => `${i}月`);
	const data = range(12).map(() => Math.floor(Math.random() * 15) + 1);

	chartOption.xAxis.data = months;
	chartOption.series[0].data = data;
	(chartOption.series[0].itemStyle as any).color = color.value;
	(chartOption.series[0].lineStyle as any).color = color.value;
}

function onChange() {
	refresh();
}

onMounted(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
.card {
	height: 400px;

	&__header {
		.year {
			font-size: 14px;
			color: var(--el-text-color-regular);
		}
	}
}
</style>