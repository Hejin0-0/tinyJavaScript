import { Dot } from "./dot.js";
import { Ripple } from "./ripple.js";
import { collide } from "./utils.js";

class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);

		// Create a temporary canvas for image processing
		// 이미지 처리를 위한 임시 캔버스 생성
		this.tmpCanvas = document.createElement("canvas");
		this.tmpCtx = this.tmpCanvas.getContext("2d");

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

		this.ripple = new Ripple();

		window.addEventListener("resize", this.resize.bind(this), false);
		this.resize();

		// Set initial properties for radius, pixel size, and dots array
		// 반지름, 픽셀 크기 및 점 배열에 대한 초기 속성 설정
		this.radius = 10;
		this.pixelSize = 30;
		this.dots = [];

		// Flag to check if the image has loaded
		// 이미지가 로드되었는지 확인하는 플래그
		this.isLoaded = false;

		this.imgPos = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		};

		this.image = new Image();
		this.image.src = "gogh2.png";
		this.image.onload = () => {
			this.isLoaded = true;
			this.drawImage();
		};

		window.requestAnimationFrame(this.animate.bind(this));

		this.canvas.addEventListener("click", this.onClick.bind(this), false);
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.tmpCanvas.width = this.stageWidth;
		this.tmpCanvas.height = this.stageHeight;

		// Resize the ripple effect to match the new canvas size
		// 새로운 캔버스 크기에 맞게 물결 효과 크기 조정
		this.ripple.resize(this.stageWidth, this.stageHeight);

		// Redraw the image if it has already loaded
		// 이미지가 이미 로드된 경우 다시 그리기
		if (this.isLoaded) {
			this.drawImage();
		}
	}

	drawImage() {
		// Calculate the aspect ratio for the stage and the image
		// 화면(또는 캔버스)의 가로세로 비율과 이미지의 가로세로 비율 계산
		const stageRatio = this.stageWidth / this.stageHeight;
		const imgRatio = this.image.width / this.image.height;

		// Set initial dimensions for the image position
		// 이미지 위치에 대한 초기 치수 설정
		this.imgPos.width = this.stageWidth;
		this.imgPos.height = this.stageHeight;

		// Adjust the image size to maintain its aspect ratio
		// 이미지의 가로세로 비율(imgRatio)을 유지하기 위해 이미지 크기 조정
		if (imgRatio > stageRatio) {
			this.imgPos.width = Math.round(
				this.image.width * (this.stageHeight / this.image.height)
			);
			this.imgPos.x = Math.round(
				(this.stageWidth - this.imgPos.width) / 2
			);
		} else {
			this.imgPos.height = Math.round(
				this.image.height * (this.stageWidth / this.image.width)
			);
			this.imgPos.y = Math.round(
				(this.stageHeight - this.imgPos.height) / 2
			);
		}
		/*
		87 ~ 90
		이미지의 가로 길이를 화면에 맞게 조정. 이 때, 이미지의 높이를 화면 높이에 맞추기 때문에 이미지의 가로 길이는 this.image.width * (this.stageHeight / this.image.height)
		→ 예를 들어, 이미지가 화면보다 더 넓을 경우 이 조건이 성립
		91 ~ 93
		이미지를 가로 중앙에 배치하기 위해, 화면 너비에서 조정된 이미지 너비를 빼고, 이를 2로 나눈 값을 x 위치로 설정
		→ 이로 인해 이미지는 화면 중앙에 가로로 배치
		95 ~ 97
		이미지의 세로 길이를 화면에 맞게 조정. 이미지의 높이는 this.image.height * (this.stageWidth / this.image.width)
		→ 예를 들어, 이미지가 화면보다 더 좁고 길다면 이 조건이 성립
		98 ~ 100
		이미지를 세로 중앙에 배치하기 위해, 화면 높이에서 조정된 이미지 높이를 빼고, 이를 2로 나눈 값을 y 위치로 설정
		→ 이로 인해 이미지는 화면 중앙에 세로로 배치
		*/

		// Draw the image on the main canvas and the temporary canvas
		// 메인 캔버스와 임시 캔버스에 이미지 그리기
		this.ctx.drawImage(
			this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			this.imgPos.x,
			this.imgPos.y,
			this.imgPos.width,
			this.imgPos.height
		);

		this.tmpCtx.drawImage(
			this.image, // 캔버스에 표시할 실제 이미지 객체
			0, // 이미지의 어느 부분부터 캔버스에 그릴지를 지정. 이 경우, 이미지의 왼쪽 경계에서 시작 (sx)
			0, // 이미지의 어느 부분부터 캔버스에 그릴지를 지정. 이 경우, 이미지의 상단 경계에서 시작 (sy)
			this.image.width, // 이미지의 어떤 너비 만큼을 잘라낼지를 지정. 이 경우, 이미지 전체
			this.image.height, // 이미지의 어떤 높이 만큼을 잘라낼지를 지정. 이 경우, 이미지 전체
			this.imgPos.x, // 캔버스에서 이미지를 그릴 시작점의 x 좌표 (dx)
			this.imgPos.y, // 캔버스에서 이미지를 그릴 시작점의 y 좌표 (dy)
			this.imgPos.width, // 캔버스에 그릴 때 이미지가 차지할 너비
			this.imgPos.height // 캔버스에 그릴 때 이미지가 차지할 높이
		);

		// Extract image data from the temporary canvas for further processing
		// 임시 캔버스에서 이미지 데이터를 추출하여 추가 처리
		this.imgData = this.tmpCtx.getImageData(
			0,
			0,
			this.stageWidth,
			this.stageHeight
		);

		// Generate dots based on the image data
		// 이미지 데이터를 기반으로 점 생성
		this.drawDots();
	}

	drawDots() {
		// Initialize the dots array and calculate the number of columns and rows
		// 점 배열을 초기화하고 열과 행의 수를 계산
		this.dots = [];

		this.columns = Math.ceil(this.stageWidth / this.pixelSize);
		this.rows = Math.ceil(this.stageHeight / this.pixelSize);

		// Loop through the rows and columns to create dots based on pixel data
		// 픽셀 데이터를 기반으로 점을 생성하기 위해 행과 열을 반복
		for (let i = 0; i < this.rows; i++) {
			const y = (i + 0.5) * this.pixelSize;
			// 현재 행의 y 좌표를 계산 i는 현재 행의 인덱스이고, pixelSize는 각 점이 차지하는 공간의 크기. 0.5를 더하는 것은 점이 각 pixelSize의 중앙에 위치하도록 하기 위함
			const pixelY = Math.max(Math.min(y, this.stageHeight), 0);
			// y 좌표를 화면 경계 내로 제한. 만약 y 좌표가 0보다 작거나 this.stageHeight보다 크다면, 각각 0 또는 this.stageHeight로 제한

			for (let j = 0; j < this.columns; j++) {
				const x = (j + 0.5) * this.pixelSize;
				const pixelX = Math.max(Math.min(x, this.stageWidth), 0);

				// Calculate the pixel index and extract RGB values
				// 픽셀 인덱스를 계산하고 RGB 값 추출
				const pixelIndex = (pixelX + pixelY * this.stageWidth) * 4;
				// '*4' 를 하는 이유는 이미지 데이터가 [red, green, blue, alpha] 순서로 저장되므로, 각 픽셀이 4개의 요소를 차지하기 때문
				const red = this.imgData.data[pixelIndex + 0];
				const green = this.imgData.data[pixelIndex + 1];
				const blue = this.imgData.data[pixelIndex + 2];

				// Create a new dot with the extracted color and add it to the dots array
				// 추출한 색상으로 새 점을 생성하고 점 배열에 추가
				const dot = new Dot(
					x,
					y,
					this.radius,
					this.pixelSize,
					red,
					green,
					blue
				);
				this.dots.push(dot);
			}
		}
	}

	animate() {
		// Request the next animation frame
		// 다음 애니메이션 프레임 요청
		window.requestAnimationFrame(this.animate.bind(this));

		// Animate the ripple effect
		// 물결 효과 애니메이션
		this.ripple.animate(this.ctx);

		// Animate the dots that collide with the ripple
		// 물결과 충돌하는 점들 애니메이션
		for (let i = 0; i < this.dots.length; i++) {
			const dot = this.dots[i];
			if (
				collide(
					dot.x,
					dot.y,
					this.ripple.x,
					this.ripple.y,
					this.ripple.radius
				)
			) {
				dot.animate(this.ctx);
			}
		}
	}

	onClick(e) {
		// Clear the canvas and reset the dots
		// 캔버스를 지우고 점들 초기화
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

		for (let i = 0; i < this.dots.length; i++) {
			this.dots[i].reset();
		}

		// Redraw the image on the canvas
		// 캔버스에 이미지를 다시 그리기
		this.ctx.drawImage(
			this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			this.imgPos.x,
			this.imgPos.y,
			this.imgPos.width,
			this.imgPos.height
		);

		// Start a new ripple effect at the click position
		// 클릭 위치에서 새로운 물결 효과 시작
		this.ripple.start(e.offsetX, e.offsetY);
	}
}

window.onload = () => {
	new App();
};

/*
Related JavaScript Documentation on MDN:
MDN Documentation on `CanvasRenderingContext2D`: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
*/
