/**
 * 生成真正随机的颜色
 * @param options 配置选项
 * @returns 十六进制颜色值
 */
export function generateRandomColor(options?: {
	/** 是否生成亮色调 */
	bright?: boolean;
	/** 最小亮度值 (0-255) */
	minBrightness?: number;
	/** 最大亮度值 (0-255) */
	maxBrightness?: number;
}): string {
	const { bright = true, minBrightness = 100, maxBrightness = 255 } = options || {};

	// 生成随机RGB值
	const generateRandomRGB = (): number => {
		if (bright) {
			// 生成较亮的颜色
			return Math.floor(Math.random() * (maxBrightness - minBrightness + 1)) + minBrightness;
		} else {
			// 生成完全随机的颜色
			return Math.floor(Math.random() * 256);
		}
	};

	const r = generateRandomRGB();
	const g = generateRandomRGB();
	const b = generateRandomRGB();

	// 转换为十六进制
	const toHex = (value: number): string => {
		return value.toString(16).padStart(2, '0').toUpperCase();
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
