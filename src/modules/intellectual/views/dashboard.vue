<template>
	<el-scrollbar>
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
					<count-card title="已获得软著数量" icon="code" :value="softGranted.value" trend-text="+12%"
						footer-label="年度新增" :footer-value="softGranted.yearlyIncrease" />
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
					<common-type-chart title="专利类型分布" :data="patentTypeData" :legend-data="['已授权', '申请中']"
						:colors="['#67C23A', '#409EFF']" />
				</el-col>
				<el-col :lg="12" :xs="24">
					<common-trend-chart 
						title="专利年度趋势" 
						:data="patentTrendData" 
						:series-config="patentTrendSeriesConfig"
					/>
				</el-col>
			</el-row>

			<!-- 软著统计图表 -->
			<el-row :gutter="10">
				<el-col :lg="12" :xs="24">
					<common-type-chart title="软著类型分布" :data="softTypeData" :legend-data="['已登记', '申请中']"
						:colors="['#E6A23C', '#F56C6C']" />
				</el-col>
				<el-col :lg="12" :xs="24">
					<common-trend-chart 
						title="软著年度趋势" 
						:data="softTrendData" 
						:series-config="softTrendSeriesConfig"
					/>
				</el-col>
			</el-row>
		</div>
	</el-scrollbar>
</template>

<script lang="ts" setup>
	import { onMounted, reactive } from 'vue';
	import { service } from '/@/cool';
	import CountCard from './components/count-card.vue';
	import CommonTypeChart from './components/common-type-chart.vue';
	import CommonTrendChart from './components/common-trend-chart.vue';
	import { useDict } from '/$/dict';

	defineOptions({
		name: 'intellectual-dashboard'
	});

	const { dict } = useDict();

	// 专利类型分布图数据
	interface ChartDataItem {
		category: string;
		values: number[];
	}
	const patentTypeData = reactive<ChartDataItem[]>([]);

	// 专利年度趋势图数据
	interface TrendDataItem {
		year: string;
		values: number[];
	}
	const patentTrendData = reactive<TrendDataItem[]>([]);
	const patentTrendSeriesConfig = reactive([
		{ name: '已授权专利', color: '#67C23A' },
		{ name: '申请的专利', color: '#409EFF' }
	]);

	// 软著类型分布图数据
	const softTypeData = reactive<ChartDataItem[]>([]);

	// 软著年度趋势图数据
	const softTrendData = reactive<TrendDataItem[]>([]);
	const softTrendSeriesConfig = reactive([
		{ name: '已登记软著', color: '#E6A23C' },
		{ name: '申请中软著', color: '#F56C6C' }
	]);

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

	// 获取专利类型分布数据
	const getPatentTypeData = async () => {
		try {
			// 获取所有专利数据
			const res = await service.intellectual.patent.page({
				page: 1,
				size: 10000
			});

			const patents = res.list || [];

			// 从字典获取专利类型映射
			const patentTypeDict = dict.get('intellectual_patent_type')?.value || [];
			const typeMap: { [key: number]: string } = {};

			// 构建类型映射
			patentTypeDict.forEach((item: any) => {
				typeMap[parseInt(item.value)] = item.label;
			});

			// 统计各类型的已授权和申请中专利数量
			const typeStats: { [key: string]: { granted: number; applying: number } } = {};

			// 初始化统计对象
			Object.values(typeMap).forEach(typeName => {
				typeStats[typeName] = { granted: 0, applying: 0 };
			});

			// 统计数据
			patents.forEach((patent: any) => {
				// 只统计在字典中存在的专利类型
				if (patent.patentType !== undefined && typeMap[patent.patentType]) {
					const typeName = typeMap[patent.patentType];

					if (patent.legalStatus === 2) {
						// 已授权
						typeStats[typeName].granted++;
					} else if (patent.legalStatus && [1, 5, 6].includes(patent.legalStatus)) {
						// 申请中
						typeStats[typeName].applying++;
					}
				}
			});

			// 转换为图表数据格式
			patentTypeData.length = 0;
			Object.keys(typeStats).forEach(typeName => {
				patentTypeData.push({
					category: typeName,
					values: [typeStats[typeName].granted, typeStats[typeName].applying]
				});
			});

		} catch (error) {
			console.error('获取专利类型分布数据失败:', error);
		}
	};

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
			patents.forEach((patent: any) => {
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
			
			// 转换为图表数据格式
			patentTrendData.length = 0;
			years.forEach(year => {
				patentTrendData.push({
					year: year.toString(),
					values: [yearStats[year].granted, yearStats[year].applying]
				});
			});
			
		} catch (error) {
			console.error('获取专利年度趋势数据失败:', error);
		}
	};

	// 获取软著类型分布数据
	const getSoftTypeData = async () => {
		try {
			// 获取所有软著数据
			const res = await service.intellectual.softCopyright.page({
				page: 1,
				size: 10000
			});

			const softs = res.list || [];

			// 从字典获取软著类型映射
			const softTypeDict = dict.get('intellectual_soft_type')?.value || [];
			const typeMap: { [key: number]: string } = {};

			// 构建类型映射
			softTypeDict.forEach((item: any) => {
				typeMap[parseInt(item.value)] = item.label;
			});

			// 统计各类型的已登记和申请中软著数量
			const typeStats: { [key: string]: { registered: number; applying: number } } = {};

			// 初始化统计对象
			Object.values(typeMap).forEach(typeName => {
				typeStats[typeName] = { registered: 0, applying: 0 };
			});

			// 统计数据
			softs.forEach((soft: any) => {
				// 只统计在字典中存在的软著类型
				if (soft.softType !== undefined && typeMap[soft.softType]) {
					const typeName = typeMap[soft.softType];

					if (soft.legalStatus === 1) {
						// 已登记
						typeStats[typeName].registered++;
					} else if (soft.legalStatus === 0) {
						// 申请中
						typeStats[typeName].applying++;
					}
				}
			});

			// 转换为图表数据格式
			softTypeData.length = 0;
			Object.keys(typeStats).forEach(typeName => {
				softTypeData.push({
					category: typeName,
					values: [typeStats[typeName].registered, typeStats[typeName].applying]
				});
			});

		} catch (error) {
			console.error('获取软著类型分布数据失败:', error);
		}
	};

	// 获取软著年度趋势数据
	const getSoftTrendData = async () => {
		try {
			// 获取所有软著数据
			const res = await service.intellectual.softCopyright.page({
				page: 1,
				size: 10000
			});
			
			const softs = res.list || [];
			const currentYear = new Date().getFullYear();
			
			// 生成近5年的年份数组
			const years: number[] = [];
			for (let i = 4; i >= 0; i--) {
				years.push(currentYear - i);
			}
			
			// 统计各年份的软著数量
			const yearStats: { [key: number]: { registered: number; applying: number } } = {};
			
			// 初始化统计对象
			years.forEach(year => {
				yearStats[year] = { registered: 0, applying: 0 };
			});
			
			// 统计数据
			softs.forEach((soft: any) => {
				// 已登记软著按登记日期年份统计
				if (soft.legalStatus === 1 && soft.registrationDate) {
					const year = new Date(soft.registrationDate).getFullYear();
					if (yearStats[year]) {
						yearStats[year].registered++;
					}
				}
				
				// 申请中软著按申请日期年份统计
				if (soft.applicationDate) {
					const year = new Date(soft.applicationDate).getFullYear();
					if (yearStats[year]) {
						yearStats[year].applying++;
					}
				}
			});
			
			// 转换为图表数据格式
			softTrendData.length = 0;
			years.forEach(year => {
				softTrendData.push({
					year: year.toString(),
					values: [yearStats[year].registered, yearStats[year].applying]
				});
			});
			
		} catch (error) {
			console.error('获取软著年度趋势数据失败:', error);
		}
	};

	// 初始化数据
	const initData = async () => {
		await Promise.all([
			getPatentStatistics(),
			getSoftStatistics(),
			getPatentTypeData(),
			getPatentTrendData(),
			getSoftTypeData(),
			getSoftTrendData()
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
