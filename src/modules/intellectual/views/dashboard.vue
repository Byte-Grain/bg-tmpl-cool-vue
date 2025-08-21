<template>
	<!-- <el-scrollbar> -->
	<div class="intellectual-dashboard">
		<!-- 专利统计指标 -->
		<el-row :gutter="10">
			<el-col :lg="8" :md="12" :xs="24">
				<count-card title="已获得专利数量" icon="document" :value="patentGranted.value" trend-text="+8%"
					footer-label="年度新增" :footer-value="patentGranted.yearlyIncrease" />
			</el-col>
			<el-col :lg="8" :md="12" :xs="24">
				<count-card title="申请中的专利数量" icon="clock" :value="patentApplying.value" trend-text="+15%"
					footer-label="年度新增" :footer-value="patentApplying.yearlyIncrease" />
			</el-col>
			<el-col :lg="8" :md="12" :xs="24">
				<count-card title="今年授权的专利数量" icon="trophy" :value="patentYearly.value" trend-text="+22%"
					footer-label="较去年同期" :footer-value="`+${patentYearly.yearlyProgress}`" />
			</el-col>
		</el-row>

		<!-- 软著统计指标 -->
		<el-row :gutter="10">
			<el-col :lg="8" :md="12" :xs="24">
				<count-card title="已获得软著数量" icon="code" :value="softGranted.value" trend-text="+12%" footer-label="年度新增"
					:footer-value="softGranted.yearlyIncrease" />
			</el-col>
			<el-col :lg="8" :md="12" :xs="24">
				<count-card title="年度计划申请软著数量" icon="calendar" :value="softPlanned.value" trend-text="+15%"
					footer-label="年度新增" :footer-value="softPlanned.yearlyIncrease" />
			</el-col>
			<el-col :lg="8" :md="12" :xs="24">
				<count-card title="年度授权软著数量" icon="medal" :value="softYearly.value" trend-text="+18%"
					footer-label="较去年同期" :footer-value="`+${softYearly.yearlyGrowth}`" />
			</el-col>
		</el-row>

		<!-- 专利统计图表 -->
		<el-row :gutter="10">
			<el-col :lg="12" :xs="24">
				<patent-type-chart />
			</el-col>
			<el-col :lg="12" :xs="24">
				<patent-trend-chart />
			</el-col>
		</el-row>
	</div>
	<!-- </el-scrollbar> -->
</template>

<script lang="ts" setup>
	import { onMounted, reactive } from 'vue';
	import { service } from '/@/cool';
	import CountCard from './components/count-card.vue';
	import PatentTypeChart from './components/patent-type-chart.vue';
	import PatentTrendChart from './components/patent-trend-chart.vue';

	defineOptions({
		name: 'intellectual-dashboard'
	});

	// 专利相关数据
	const patentGranted = reactive({
		value: 0,
		yearlyIncrease: 0
	});

	const patentApplying = reactive({
		value: 0,
		yearlyIncrease: 0
	});

	const patentYearly = reactive({
		value: 0,
		yearlyProgress: 0
	});

	// 软著相关数据
	const softGranted = reactive({
		value: 0,
		yearlyIncrease: 0
	});

	const softPlanned = reactive({
		value: 0,
		yearlyIncrease: 0
	});

	const softYearly = reactive({
		value: 0,
		yearlyGrowth: 0
	});

	// 获取所有专利数据并计算统计指标
	const getPatentStatistics = async () => {
		try {
			// 获取所有专利数据
			const res = await service.intellectual.patent.page({
				page: 1,
				size: 10000 // 获取足够多的数据
			});

			const patents = res.list || [];
			const now = new Date();
			const currentYear = now.getFullYear();
			const startOfYear = new Date(currentYear, 0, 1);
			const endOfYear = new Date(currentYear, 11, 31);

			// 已获得专利数量（法律状态为已授权）
			const grantedPatents = patents.filter(patent => patent.legalStatus === 2);
			patentGranted.value = grantedPatents.length;

			// 年度新增已授权专利数量（证书日期在今年）
			const yearlyGrantedPatents = grantedPatents.filter(patent => {
				if (!patent.certificateDate) return false;
				const certDate = new Date(patent.certificateDate);
				return certDate >= startOfYear && certDate <= endOfYear;
			});
			patentGranted.yearlyIncrease = yearlyGrantedPatents.length;

			// 申请中专利数量（法律状态为审查中、待诉讼、驳回复审）
			const applyingStatusList = [1, 5, 6];
			const applyingPatents = patents.filter(patent => patent.legalStatus && applyingStatusList.includes(patent.legalStatus));
			patentApplying.value = applyingPatents.length;

			// 年度新增申请中专利数量（申请日期在今年）
			const yearlyApplyingPatents = applyingPatents.filter(patent => {
				if (!patent.applicationDate) return false;
				const appDate = new Date(patent.applicationDate);
				return appDate >= startOfYear && appDate <= endOfYear;
			});
			patentApplying.yearlyIncrease = yearlyApplyingPatents.length;

			// 今年授权专利数量（证书日期在今年的已授权专利）
			patentYearly.value = yearlyGrantedPatents.length;

			// 计算进度百分比（假设年度目标为50个专利）
			const yearlyTarget = 50;
			patentYearly.yearlyProgress = Math.min(Math.round((patentYearly.value / yearlyTarget) * 100), 100);

		} catch (error) {
			console.error('获取专利统计数据失败:', error);
		}
	};

	// 获取所有软著数据并计算统计指标
	const getSoftStatistics = async () => {
		try {
			// 获取所有软著数据
			const res = await service.intellectual.softCopyright.page({
				page: 1,
				size: 10000 // 获取足够多的数据
			});

			const softs = res.list || [];
			const now = new Date();
			const currentYear = now.getFullYear();
			const lastYear = currentYear - 1;
			const startOfYear = new Date(currentYear, 0, 1);
			const endOfYear = new Date(currentYear, 11, 31);
			const lastYearStart = new Date(lastYear, 0, 1);
			const lastYearEnd = new Date(lastYear, 11, 31);

			// 已获得软著数量（法律状态为已登记）
			const grantedSofts = softs.filter(soft => soft.legalStatus === 1);
			softGranted.value = grantedSofts.length;

			// 年度新增已登记软著数量（申请日期在今年）
			const yearlyGrantedSofts = grantedSofts.filter(soft => {
				if (!soft.applicationDate) return false;
				const appDate = new Date(soft.applicationDate);
				return appDate >= startOfYear && appDate <= endOfYear;
			});
			softGranted.yearlyIncrease = yearlyGrantedSofts.length;

			// 年度计划申请软著数量（法律状态为申请中）
			const plannedSofts = softs.filter(soft => soft.legalStatus === 0);
			softPlanned.value = plannedSofts.length;

			// 年度新增申请中软著数量（申请日期在今年）
			const yearlyPlannedSofts = plannedSofts.filter(soft => {
				if (!soft.applicationDate) return false;
				const appDate = new Date(soft.applicationDate);
				return appDate >= startOfYear && appDate <= endOfYear;
			});
			softPlanned.yearlyIncrease = yearlyPlannedSofts.length;

			// 年度授权软著数量（今年已登记的软著）
			softYearly.value = yearlyGrantedSofts.length;

			// 获取去年同期数据
			const lastYearGrantedSofts = grantedSofts.filter(soft => {
				if (!soft.applicationDate) return false;
				const appDate = new Date(soft.applicationDate);
				return appDate >= lastYearStart && appDate <= lastYearEnd;
			});
			const lastYearCount = lastYearGrantedSofts.length;

			// 计算年度增长百分比
			if (lastYearCount > 0) {
				softYearly.yearlyGrowth = Math.round(((softYearly.value - lastYearCount) / lastYearCount) * 100);
			} else {
				softYearly.yearlyGrowth = softYearly.value > 0 ? 100 : 0;
			}

		} catch (error) {
			console.error('获取软著统计数据失败:', error);
		}
	};

	// 初始化数据
	const initData = async () => {
		await Promise.all([
			getPatentStatistics(),
			getSoftStatistics()
		]);
	};

	onMounted(() => {
		initData();
	});
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
