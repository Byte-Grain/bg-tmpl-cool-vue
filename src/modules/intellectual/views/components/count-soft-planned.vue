<template>
	<div class="count-soft-planned">
		<div class="card">
			<div class="card__header">
				<span class="label">{{ $t('年度计划申请软著数量') }}</span>
				<cl-svg name="calendar" class="icon" />
			</div>

			<div class="card__container">
				<cl-number :value="num" class="num" />

				<div class="progress-info">
					<span class="progress-text">{{ $t('完成进度') }}: {{ progressPercent }}%</span>
					<el-progress :percentage="progressPercent" :stroke-width="6" />
				</div>
			</div>

			<div class="card__footer">
				<span class="label">{{ $t('已完成') }}</span>
				<span>{{ completed }}/{{ num }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { random } from 'lodash-es';
import { computed, onMounted, ref } from 'vue';

const num = ref(0);
const completed = ref(0);

const progressPercent = computed(() => {
	if (num.value === 0) return 0;
	return Math.round((completed.value / num.value) * 100);
});

onMounted(() => {
	// 模拟数据，后续替换为真实API调用
	num.value = random(20, 50);
	completed.value = random(5, num.value);
});
</script>

<style lang="scss" scoped>
.count-soft-planned {
	.progress-info {
		margin-top: 10px;
		
		.progress-text {
			font-size: 12px;
			color: var(--el-text-color-regular);
			margin-bottom: 5px;
			display: block;
		}
	}

	.fall,
	.rise {
		display: inline-flex;
		align-items: center;
		margin-left: 10px;
	}

	.fall {
		color: var(--el-color-danger);
	}

	.rise {
		color: var(--el-color-success);
	}
}
</style>