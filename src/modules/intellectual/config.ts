import { ModuleConfig } from '/@/cool';
import { App } from 'vue';

export default (): ModuleConfig => {
	const config = {
		name: 'intellectual',
		label: '知识产权',
		description: '知识产权管理模块',
		version: '1.0.0',
		author: 'COOL',
		updateTime: '2024-01-01',
		options: {
			module: 'intellectual'
		},
		install(app: App) {
			// 设置全局属性，用于在组件中获取当前模块名
			app.config.globalProperties.$intellectualModule = config.name;

			// 提供全局注入，用于在组合式API中使用
			app.provide('intellectualModule', config.name);
		}
	};

	// 设置options.module为name字段的值
	config.options.module = config.name;

	return config;
};
