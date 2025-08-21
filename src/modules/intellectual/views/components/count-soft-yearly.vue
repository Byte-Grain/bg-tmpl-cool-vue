<template>
	<div class="count-soft-yearly">
		<div class="card">
			<div class="card__header">
				<span class="label">{{ $t('年度授权软著数量') }}</span>
				<cl-svg name="medal" class="icon" />
			</div>

			<div class="card__container">
				<cl-number :value="num" class="num" />

				<div class="rise">
					<el-icon>
						<top-right />
					</el-icon>

					<span>+18%</span>
				</div>
			</div>

			<div class="card__footer">
				<span class="label">{{ $t('较去年同期') }}</span>
				<span>+{{ yearlyGrowth }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { TopRight } from '@element-plus/icons-vue';
import { random } from 'lodash-es';
import { onMounted, ref } from 'vue';

const num = ref(0);
const yearlyGrowth = ref(0);

onMounted(() => {
	// 模拟数据，后续替换为真实API调用
	num.value = random(10, 40);
	yearlyGrowth.value = random(2, 12);
});
</script>

<style lang="scss" scoped>
.count-soft-yearly {
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