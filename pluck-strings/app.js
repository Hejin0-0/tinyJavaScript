import { BounceString } from "./bouncestrings.js";
import { Ball } from "./ball.js";

class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		/* Initialize properties for strings, mouse position, and mouse state */
		/* 문자열, 마우스 위치 및 마우스 상태에 대한 속성을 초기화함 */
		this.strings = [];
		this.moveX = -5000;
		this.moveY = -5000;
		this.isDown = false;

		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();

		/* Create a new Ball object */
		/* 새로운 공 객체를 생성함 */
		this.ball = new Ball(this.stageWidth, this.stageHeight, 70, 6);

		/* Add event listeners for pointer (mouse/touch) events */
		/* 포인터 (마우스/터치) 이벤트에 대한 이벤트 리스너를 추가함 */
		document.addEventListener("pointerdown", this.onDown.bind(this), false);
		document.addEventListener("pointermove", this.onMove.bind(this), false);
		document.addEventListener("pointerup", this.onUp.bind(this), false);

		window.requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;

		/* Scale the drawing context according to the pixel ratio */
		/* 픽셀 비율에 따라 드로잉 컨텍스트를 스케일 조정함 */
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		/* Define the gap between strings */
		/* 문자열 사이의 간격을 정의함 */
		const xGap = 20;
		const yGap = 20;
		const x1 = xGap;
		const x2 = this.stageWidth - xGap;
		/* Calculate the total number of strings that can fit vertically */
		/* 수직으로 맞출 수 있는 문자열의 총 수를 계산함 */
		const total = Math.floor((this.stageHeight - yGap) / yGap);

		/* Create BounceString objects for each vertical position */
		/* 각 수직 위치에 대해 BounceString 객체를 생성함 */
		this.strings = [];

		for (let i = 0; i < total; i++) {
			this.strings[i] = new BounceString(
				{
					x1: x1,
					y1: i * yGap + yGap,
					x2: x2,
					y2: i * yGap + yGap,
				},
				"#ff5038"
			);
		}
	}

	animate() {
		window.requestAnimationFrame(this.animate.bind(this));
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		/* Animate each BounceString object */
		/* 각 BounceString 객체를 애니메이트함 */
		if (this.strings.length > 0) {
			for (let i = 0; i < this.strings.length; i++) {
				this.strings[i].animate(this.ctx, this.ball.x, this.ball.y);
			}
		}

		/* Animate the ball */
		/* 공을 애니메이트함 */
		this.ball.animate(this.ctx, this.stageWidth, this.stageHeight);
	}

	/* Handle pointer down events */
	/* 포인터 다운 이벤트를 처리함 */
	onDown(e) {
		this.isDown = true;
		this.moveX = e.clientX;
		this.moveY = e.clientY;
	}

	/* Handle pointer move events */
	/* 포인터 이동 이벤트를 처리함 */
	onMove(e) {
		if (this.isDown) {
			this.moveX = e.clientX;
			this.moveY = e.clientY;
		}
	}

	/* Handle pointer up events */
	/* 포인터 업 이벤트를 처리함 */
	onUp(e) {
		this.isDown = false;
		this.moveX = -5000;
		this.moveY = -5000;
	}
}

window.onload = () => {
	new App();
};

/* Related MDN Web Docs */
/* 관련된 MDN 웹 문서 */
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
