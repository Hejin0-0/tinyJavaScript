import { Point } from "./point.js";

export class Wave {
	constructor(index, totalPoints, color) {
		// Initialize the wave properties
		// 웨이브 속성을 초기화
		this.index = index;
		this.totalPoints = totalPoints;
		this.color = color;
		this.points = [];
	}

	resize(stageWidth, stageHeight) {
		// Store the stage dimensions
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		// Calculate the center of the stage
		this.centerX = stageWidth / 2;
		this.centerY = stageHeight / 2;

		// Calculate the gap between points
		// 포인트 사이의 간격을 계산 ... `전체 넓이 / (전체 점의 숫자 - 1)`
		this.pointGap = this.stageWidth / (this.totalPoints - 1);

		// Initialize the points
		// 포인트를 초기화
		this.init();
	}

	init() {
		// Clear the points array
		// 포인트 배열을 초기화
		this.points = [];

		// Create points at equal intervals
		// 일정한 간격으로 포인트를 생성 ... index를 넣어주는 이유는 각 점의 위치에 따라 파동이 움직이는 모양도 다르게 하기 위함
		for (let i = 0; i < this.totalPoints; i++) {
			const point = new Point(
				this.index + i,
				this.pointGap * i,
				this.centerY
			);
			this.points[i] = point;
		}
	}

	draw(ctx) {
		// Start drawing the wave
		// 웨이브 그리기
		ctx.beginPath();
		ctx.fillStyle = this.color;

		// Move to the first point
		// 첫 번째 포인트로 이동
		let prevX = this.points[0].x;
		let prevY = this.points[0].y;

		ctx.moveTo(prevX, prevY);

		// Draw a smooth curve through the points
		// 포인트를 통해 부드러운 곡선을 그리기
		for (let i = 1; i < this.totalPoints; i++) {
			if (i < this.totalPoints - 1) {
				this.points[i].update();
			}

			const cx = (prevX + this.points[i].x) / 2;
			const cy = (prevY + this.points[i].y) / 2;

			ctx.quadraticCurveTo(prevX, prevY, cx, cy);

			prevX = this.points[i].x;
			prevY = this.points[i].y;
		}

		// Complete the path and fill the shape
		ctx.lineTo(prevX, prevY);
		ctx.lineTo(this.stageWidth, this.stageHeight);
		ctx.lineTo(this.points[0].x, this.stageHeight);
		ctx.fill();
		ctx.closePath();
	}
}

/**
 * Links to relevant MDN Web Docs:
 * - `ctx.beginPath`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath
 * - `ctx.fillStyle`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
 * - `ctx.moveTo`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo
 * - `ctx.quadraticCurveTo`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo
 * - `ctx.lineTo`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo
 * - `ctx.fill`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill
 * - `ctx.closePath`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath
 */
