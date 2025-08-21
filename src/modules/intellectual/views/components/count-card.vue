<template>
	<div class="count-card">
		<div class="card">
			<div class="card__header">
				<span class="label">{{ $t(title) }}</span>
				<cl-svg :name="icon" class="icon" />
			</div>

			<div class="card__container">
				<cl-number :value="value" class="num" />

				<div class="rise">
					<el-icon>
						<top-right />
					</el-icon>

					<span>{{ trendText }}</span>
				</div>
			</div>

			<div class="card__footer">
				<span class="label">{{ $t(footerLabel) }}</span>
				<span>{{ footerValue }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { TopRight } from '@element-plus/icons-vue';

interface Props {
	/** 卡片标题 */
	title: string;
	/** 图标名称 */
	icon: string;
	/** 主要数值 */
	value: number;
	/** 趋势文本 */
	trendText: string;
	/** 底部标签 */
	footerLabel: string;
	/** 底部数值 */
	footerValue: string | number;
}

defineProps<Props>();
</script>

<style lang="scss" scoped>
.count-card {
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
