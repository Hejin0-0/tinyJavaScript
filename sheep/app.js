import { Hill } from "./hill.js";
import { SheepController } from "./sheep-controller.js";
import { Sun } from "./sun.js";

class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

		this.sun = new Sun();

		this.hills = [
			new Hill("#ff4674", 0.2, 12),
			new Hill("#ff59c2", 0.5, 8),
			new Hill("#ff4674", 1.4, 6),
		];
		/* Create an array of Hill instances with different colors, speeds, and amplitudes */
		/* 다양한 색상, 속도, 진폭을 가진 Hill 인스턴스 배열을 생성함 */

		this.sheepController = new SheepController();

		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();

		requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * 2;
		this.canvas.height = this.stageHeight * 2;

		this.ctx.scale(2, 2);

		this.sun.resize(this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.hills.length; i++) {
			this.hills[i].resize(this.stageWidth, this.stageHeight);
			/* Call the resize method on each hill instance */
			/* 각 Hill 인스턴스의 resize 메서드를 호출함 */
		}

		this.sheepController.resize(this.stageWidth, this.stageHeight);
		/* Call the resize method on the sheepController instance */
		/* sheepController 인스턴스의 resize 메서드를 호출함 */
	}

	animate(t) {
		requestAnimationFrame(this.animate.bind(this));

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		this.sun.draw(this.ctx, t);

		let dots;
		for (let i = 0; i < this.hills.length; i++) {
			dots = this.hills[i].draw(this.ctx);
			/* Draw each hill on the canvas */
			/* 캔버스에 각 Hill을 그림 */
		}

		this.sheepController.draw(this.ctx, t, dots);
		/* Draw the sheep on the canvas */
		/* 캔버스에 양을 그림 */
	}
}

window.onload = () => {
	new App();
};

/* Reference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API */
