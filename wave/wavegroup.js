import { Wave } from "./wave.js";

export class WaveGroup {
	constructor() {
		// Set the total number of waves and points per wave
		// 웨이브와 각 웨이브당 포인트의 총 수를 설정 ... 포인트? 위 코드로 3개의 X 축에 6개의 Y축 생성
		this.totalWaves = 3;
		this.totalPoints = 6;

		// Define the colors for each wave
		this.color = [
			"rgba(255, 0, 0, 0.4)", // red
			"rgba(0, 255, 0, 0.4)", // green
			"rgba(0, 0, 255, 0.4)", // blue
		];

		// Initialize the waves array
		// 웨이브 배열을 초기화
		this.waves = [];

		// Create the wave objects
		// 웨이브 객체를 생성
		for (let i = 0; i < this.totalWaves; i++) {
			const wave = new Wave(i, this.totalPoints, this.color[i]);
			this.waves[i] = wave;
		}
	}

	resize(stageWidth, stageHeight) {
		// Adjust the size of each wave according to the stage dimensions
		// 무대 크기에 따라 각 웨이브의 크기를 조정
		for (let i = 0; i < this.totalWaves; i++) {
			const wave = this.waves[i];
			wave.resize(stageWidth, stageHeight);
		}
	}

	draw(ctx) {
		// Draw each wave on the canvas
		// 그리기
		for (let i = 0; i < this.totalWaves; i++) {
			const wave = this.waves[i];
			wave.draw(ctx);
		}
	}
}

/**
 * Links to relevant MDN Web Docs:
 * - `Array`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 * - `Array.prototype.push`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
 * - `for...of`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
 */
