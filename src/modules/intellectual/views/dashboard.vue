<template>
	<el-scrollbar>
		<div class="intellectual-dashboard">
			<!-- 专利统计指标 -->
			<el-row :gutter="10">
				<el-col :lg="8" :md="12" :xs="24">
					<count-patent-granted />
				</el-col>
				<el-col :lg="8" :md="12" :xs="24">
					<count-patent-applying />
				</el-col>
				<el-col :lg="8" :md="12" :xs="24">
					<count-patent-yearly />
				</el-col>
			</el-row>

			<!-- 软著统计指标 -->
			<el-row :gutter="10">
				<el-col :lg="8" :md="12" :xs="24">
					<count-soft-granted />
				</el-col>
				<el-col :lg="8" :md="12" :xs="24">
					<count-soft-planned />
				</el-col>
				<el-col :lg="8" :md="12" :xs="24">
					<count-soft-yearly />
				</el-col>
			</el-row>

			<!-- 统计图表 -->
			<el-row :gutter="10">
				<el-col :lg="12" :xs="24">
					<patent-chart />
				</el-col>
				<el-col :lg="12" :xs="24">
					<soft-chart />
				</el-col>
			</el-row>
		</div>
	</el-scrollbar>
</template>

<script lang="ts" setup>
defineOptions({
	name: 'intellectual-dashboard'
});

import CountPatentGranted from './components/count-patent-granted.vue';
import CountPatentApplying from './components/count-patent-applying.vue';
import CountPatentYearly from './components/count-patent-yearly.vue';
import CountSoftGranted from './components/count-soft-granted.vue';
import CountSoftPlanned from './components/count-soft-planned.vue';
import CountSoftYearly from './components/count-soft-yearly.vue';
import PatentChart from './components/patent-chart.vue';
import SoftChart from './components/soft-chart.vue';
</script>

<style lang="scss">
.intellectual-dashboard {
	overflow-x: hidden;

	.card {
		border-radius: 10px;
		margin-bottom: 10px;
		border: 1px solid var(--el-border-color-extra-light);
		background-color: var(--el-bg-color);
		color: var(--el-text-color-primary);
		user-select: none;

		&__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10px 20px;
			min-height: 50px;

			.label {
				font-size: 15px;
			}

			.icon {
				font-size: 30px;
				background-color: var(--el-fill-color-light);
				padding: 5px;
				border-radius: 6px;
			}
		}

		&__container {
			padding: 0 20px;
			min-height: 50px;

			.num {
				font-size: 32px;
			}
		}

		&__footer {
			display: flex;
			align-items: center;
			height: 50px;
			margin: 0 5px;
			padding: 0 15px;
			box-sizing: border-box;
			font-size: 12px;

			.label {
				margin-right: 10px;
			}
		}
	}
}
</style>