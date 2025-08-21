<template>
	<div class="count-patent-granted">
		<div class="card">
			<div class="card__header">
				<span class="label">{{ $t('已获得专利数量') }}</span>
				<cl-svg name="document" class="icon" />
			</div>

			<div class="card__container">
				<cl-number :value="num" class="num" />

				<div class="rise">
					<el-icon>
						<top-right />
					</el-icon>

					<span>+8%</span>
				</div>
			</div>

			<div class="card__footer">
				<span class="label">{{ $t('本月新增') }}</span>
				<span>{{ monthlyIncrease }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { TopRight } from '@element-plus/icons-vue';
import { random } from 'lodash-es';
import { onMounted, ref } from 'vue';

const num = ref(0);
const monthlyIncrease = ref(0);

onMounted(() => {
	// 模拟数据，后续替换为真实API调用
	num.value = random(50, 200);
	monthlyIncrease.value = random(1, 10);
});
</script>

<style lang="scss" scoped>
.count-patent-granted {
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