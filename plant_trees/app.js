import { Tree } from "./tree.js"; // Import the Tree class from tree.js

class App {
	constructor() {
		// Create a canvas element and get its 2D context
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		this.init();
		this.setEventListeners();
		this.resize();
	}

	init() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.day = true;
		this.setButtons();
	}

	setEventListeners() {
		window.addEventListener("resize", this.resize.bind(this), false);
		window.addEventListener("click", this.handleClick.bind(this), false);
	}

	setButtons() {
		this.nightBtn = document.querySelector(".night");
		this.dayBtn = document.querySelector(".day");

		this.nightBtn.addEventListener(
			"click",
			this.setNightMode.bind(this),
			false
		);
		this.dayBtn.addEventListener(
			"click",
			this.setDayMode.bind(this),
			false
		);
	}

	setNightMode() {
		this.clearCanvas();
		this.day = false;
		this.toggleButtons();
		document.body.classList.add("black");
	}

	setDayMode() {
		this.clearCanvas();
		this.day = true;
		this.toggleButtons();
		document.body.classList.remove("black");
	}

	toggleButtons() {
		this.dayBtn.classList.toggle("show");
		this.nightBtn.classList.toggle("show");
	}
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
	}

	handleClick(event) {
		if (event.target.className !== "material-icons") {
			// 클릭된 요소가 아이콘이 아닌 경우
			new Tree(this.ctx, event.clientX, this.stageHeight, this.day);
		}
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.clearCanvas();
	}
}

window.onload = () => {
	new App();
};

/*
  - App 클래스는 브라우저 창의 크기와 해상도에 따라 캔버스를 설정하고,
    클릭 이벤트에 따라 나무를 생성하며,
    낮/밤 모드를 전환하는 버튼을 제공합니다.
  - resize() 메서드는 창 크기 변경 시 캔버스를 조정하고,
    clearCanvas() 메서드는 캔버스를 지우며,
    handleClick() 메서드는 클릭된 위치에 나무를 생성합니다.

  - Tree 클래스에 대한 설명은 tree.js 파일을 참조하세요.
*/

/*
  관련 MDN 문서:
  - [CanvasRenderingContext2D.clearRect()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clearRect)
  - [window.devicePixelRatio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio)
  - [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)
  - [window.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
*/

/*
class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		window.addEventListener("resize", this.resize.bind(this), false);
		window.addEventListener("click", this.click.bind(this), false);
		this.resize();
		this.setBtn();

		// new Tree(this.ctx, this.stageWidth / 2, this.stageHeight);
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
	}

	setBtn() {
		this.nightBtn = document.querySelector(".night");
		this.dayBtn = document.querySelector(".day");

		this.day = true;

		this.nightBtn.addEventListener(
			"click",
			this.nightBtnHandler.bind(this),
			false
		);
		this.dayBtn.addEventListener(
			"click",
			this.dayBtnHandler.bind(this),
			false
		);
	}

	nightBtnHandler() {
		this.resize();
		this.dayBtn.classList.add("show");
		this.nightBtn.classList.remove("show");
		document.body.classList.add("black");
		this.day = false;
	}

	dayBtnHandler() {
		this.resize();
		this.dayBtn.classList.remove("show");
		this.nightBtn.classList.add("show");
		document.body.classList.remove("black");
		this.day = true;
	}

	click(event) {
		const { clientX } = event;
		if (event.target.className !== "material-icons")
			new Tree(this.ctx, clientX, this.stageHeight, this.day);
	}
}

window.onload = () => {
	new App();
};
*/
