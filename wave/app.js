import { WaveGroup } from "./wavegroup.js";

class App {
	constructor() {
		// Create a canvas element
		this.canvas = document.createElement("canvas");

		// Get the 2D drawing context from the canvas
		this.ctx = this.canvas.getContext("2d");

		// Append the canvas to the document body
		document.body.appendChild(this.canvas);

		// Create an instance of WaveGroup
		// WaveGroup의 인스턴스를 생성합
		this.waveGroup = new WaveGroup();

		// Add a resize event listener to the window
		// window창에 resize 이벤트 리스너를 추가
		window.addEventListener("resize", this.resize.bind(this), false);

		// Initial resize to set up the canvas dimensions
		// 초기화 리사이즈를 수행하여 캔버스 크기 설정
		this.resize();

		// Start the animation loop
		// 애니메이션 루프 시작
		requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		// Get the current width and height of the viewport
		// 현재 뷰포트의 너비와 높이
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		// Set the canvas width and height to twice the viewport dimensions
		// to account for high-DPI screens
		// 고해상도 화면을 고려하여 캔버스의 너비와 높이를 뷰포트 크기의 두 배로 설정
		this.canvas.width = this.stageWidth * 2;
		this.canvas.height = this.stageHeight * 2;

		// Scale the drawing context to match the new dimensions
		// 새 크기에 맞게 드로잉 컨텍스트를 스케일링.. 1x1 pixel을 2x2 pixel로
		this.ctx.scale(2, 2);

		// Resize the wave group to match the new canvas dimensions
		// 새 캔버스 크기에 맞게 웨이브 그룹을 리사이즈
		this.waveGroup.resize(this.stageWidth, this.stageHeight);
	}

	animate(t) {
		// Clear the canvas before each redraw
		// 매번 다시 그리기 전에 캔버스를 clear
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		// Draw the wave group on the canvas
		// 그리기
		this.waveGroup.draw(this.ctx);

		// Request the next animation frame
		// 다음 애니메이션 프레임을 요청
		requestAnimationFrame(this.animate.bind(this));
	}
}

// Instantiate the App class when the window loads
window.onload = () => {
	new App();
};

/**
 * Links to relevant MDN Web Docs:
 * - `document.createElement`: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * - `canvas.getContext`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
 * - `document.body.appendChild`: https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
 * - `window.addEventListener`: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * - `window.requestAnimationFrame`: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 * - `CanvasRenderingContext2D.clearRect`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect
 * - `CanvasRenderingContext2D.scale`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale
 */
