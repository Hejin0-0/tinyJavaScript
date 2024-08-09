import { Polygon } from "./polygon.js";

class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");

		document.body.appendChild(this.canvas);

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();

		this.isDown = false;
		// Initialize isDown to track if the mouse is pressed
		// 마우스가 눌려 있는지 추적하기 위해 isDown을 초기화

		this.moveX = 0;
		// Initialize moveX to track horizontal movement
		// 수평 이동을 추적하기 위해 moveX를 초기화

		this.offsetX = 0;
		// Initialize offsetX to track the starting X position
		// 시작 X 위치를 추적하기 위해 offsetX를 초기화

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

		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.polygon = new Polygon(
			this.stageWidth / 2,
			this.stageHeight + this.stageHeight / 4,
			this.stageHeight / 1.5,
			15
		);
		// Create a new Polygon instance with specific parameters
		// 특정 매개변수로 새 Polygon 인스턴스를 생성
	}

	animate() {
		window.requestAnimationFrame(this.animate.bind(this));

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		this.moveX *= 0.92;
		// Apply friction to the movement
		// 움직임에 마찰을 적용

		this.polygon.animate(this.ctx, this.moveX);
		// Animate the polygon with the updated moveX value
		// 업데이트된 moveX 값으로 다각형을 애니메이션 처리
	}

	onDown(e) {
		this.isDown = true;
		// Set isDown to true to indicate the mouse is pressed
		// 마우스가 눌려 있음을 나타내기 위해 isDown을 true로 설정

		this.moveX = 0;
		// Reset moveX to 0
		// moveX를 0으로 리셋

		this.offsetX = e.clientX;
		// Set offsetX to the X position of the event
		// 이벤트의 X 위치로 offsetX를 설정
	}

	onMove(e) {
		if (this.isDown) {
			// Check if the mouse is pressed
			// 마우스가 눌려 있는지 확인

			this.moveX = e.clientX - this.offsetX;
			// Calculate the movement since the last event
			// 마지막 이벤트 이후의 움직임을 계산

			this.offsetX = e.clientX;
			// Update offsetX to the current X position
			// 현재 X 위치로 offsetX를 업데이트
		}
	}

	onUp(e) {
		this.isDown = false;
		// Set isDown to false to indicate the mouse is released
		// 마우스가 해제되었음을 나타내기 위해 isDown을 false로 설정
	}
}

window.onload = () => {
	new App();
};
