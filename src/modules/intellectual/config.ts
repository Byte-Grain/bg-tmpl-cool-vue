import { ModuleConfig } from '/@/cool';
import { App } from 'vue';

// TODO: 统一为upload插件增加module属性，用于按照模块存储数据
export default (): ModuleConfig => {
	const config = {
		name: 'intellectual',
		label: '知识产权',
		description: '知识产权管理模块',
		version: '1.0.0',
		author: '不就订个外卖么<yeclimeric@gmail.com>',
		updateTime: '2025-08-21',
		install(app: App) {}
	};

	return config;
};
