import { Point } from "./point.js";
import { Dialog } from "./dialog.js";

class App {
	constructor() {
		// Create a canvas element and add it to the document body
		// 캔버스 요소를 생성하고 문서 본문에 추가함
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		// Set pixel ratio for high DPI displays
		// 고해상도 디스플레이를 위한 픽셀 비율 설정함
		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		// Initialize mouse position and current item
		// 마우스 위치와 현재 항목을 초기화함
		this.mousePos = new Point();
		this.curItem = null;

		// Create and initialize dialog items
		// dialog 항목을 생성하고 초기화함
		this.items = [];
		this.total = 5;
		for (let i = 0; i < this.total; i++) {
			this.items[i] = new Dialog();
		}

		// Add event listeners for resize and user interaction
		// 크기 조정 및 사용자 상호작용을 위한 이벤트 리스너 추가함
		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();

		window.requestAnimationFrame(this.animate.bind(this));

		document.addEventListener("pointerdown", this.onDown.bind(this), false);
		document.addEventListener("pointermove", this.onMove.bind(this), false);
		document.addEventListener("pointerup", this.onUp.bind(this), false);
	}

	resize() {
		// Adjust the canvas size based on the window size
		// 창 크기에 따라 캔버스 크기를 조정함
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		// Set shadow and line styles
		// 그림자 및 선 스타일 설정함
		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 3;
		this.ctx.shadowBlur = 6;
		this.ctx.shadowColor = `rgba(0, 0, 0, 0.5)`;
		this.ctx.lineWidth = 2;

		// Resize dialog items based on the stage size
		// window 크기에 따라 dialog 항목 크기를 조정함
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].resize(this.stageWidth, this.stageHeight);
		}
	}

	animate() {
		// Clear the canvas and draw the dialog items
		// 캔버스를 지우고 dialog 항목을 그림
		window.requestAnimationFrame(this.animate.bind(this));
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.items.length; i++) {
			this.items[i].animate(this.ctx);
		}

		// If an item is being interacted with, draw the interaction lines
		// 항목이 상호작용 중인 경우 상호작용 선을 그림
		if (this.curItem) {
			this.ctx.fillStyle = `#ff4338`;
			this.ctx.strokeStyle = `#ff4338`;

			this.ctx.beginPath();
			this.ctx.arc(this.mousePos.x, this.mousePos.y, 8, 0, Math.PI * 2);
			this.ctx.fill();

			this.ctx.beginPath();
			this.ctx.arc(
				this.curItem.centerPos.x,
				this.curItem.centerPos.y,
				8,
				0,
				Math.PI * 2
			);
			this.ctx.fill();

			this.ctx.beginPath();
			this.ctx.moveTo(this.mousePos.x, this.mousePos.y);
			this.ctx.lineTo(this.curItem.centerPos.x, this.curItem.centerPos.y);
			this.ctx.stroke();
		}
	}

	onDown(e) {
		// Update the mouse position and check if any item is selected
		// 마우스 위치를 업데이트하고 항목이 선택되었는지 확인함
		this.mousePos.x = e.clientX;
		this.mousePos.y = e.clientY;

		for (let i = this.items.length - 1; i >= 0; i--) {
			const item = this.items[i].down(this.mousePos.clone());
			if (item) {
				this.curItem = item;
				const index = this.items.indexOf(item);
				this.items.push(this.items.splice(index, 1)[0]);
				break;
			}
		}
	}

	onMove(e) {
		// Update the mouse position and move the selected item
		// 마우스 위치를 업데이트하고 선택된 항목을 이동함
		this.mousePos.x = e.clientX;
		this.mousePos.y = e.clientY;

		for (let i = 0; i < this.items.length; i++) {
			this.items[i].move(this.mousePos.clone());
		}
	}

	onUp(e) {
		// Deselect the current item
		// 현재 항목 선택을 해제함
		this.curItem = null;

		// Call the up method for each item
		// 각 항목에 대해 up 메서드를 호출함
		for (let i = 0; i < this.items.length; i++) {
			this.items[i].up();
		}
	}
}

window.onload = () => {
	new App();
};

/**
 * Links to relevant MDN Web Docs:
 * - `document.createElement`: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
 * - `Element.appendChild`: https://developer.mozilla.org/en-US/docs/Web/API/Element/appendChild
 * - `window.requestAnimationFrame`: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
 * - `EventTarget.addEventListener`: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * - `CanvasRenderingContext2D`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
 */
