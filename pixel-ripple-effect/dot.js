const PI2 = Math.PI * 2; // Full circle in radians (360 degrees) // 전체 원의 각도 (360도)
const BOUNCE = 0.82; // Bounce factor for radius animation // 반동 효과를 결정하는 계수

export class Dot {
	constructor(x, y, radius, pixelSize, red, green, blue) {
		this.x = x;
		this.y = y;
		this.targetRadius = radius;
		this.radius = 0; // Current radius of the dot (initially 0) // 점의 현재 반지름 (초기값은 0)
		this.radiusV = 0; // Velocity of the radius change // 반지름의 변화 속도
		this.pixelSize = pixelSize; // Size of the pixel that the dot represents // 점이 나타내는 픽셀의 크기
		this.pixelSizeHalf = pixelSize / 2; // Half of the pixel size for positioning // 위치 설정을 위한 픽셀 크기의 절반
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	animate(ctx) {
		ctx.beginPath();
		ctx.fillStyle = "#000"; // Set fill color to black // 채우기 색상을 검은색으로 설정
		ctx.fillRect(
			this.x - this.pixelSizeHalf, // X-coordinate of the top-left corner of the rectangle // 사각형의 왼쪽 상단 X 좌표
			this.y - this.pixelSizeHalf, // Y-coordinate of the top-left corner of the rectangle // 사각형의 왼쪽 상단 Y 좌표
			this.pixelSize, // Width of the rectangle // 사각형의 너비
			this.pixelSize // Height of the rectangle // 사각형의 높이
		);

		// Calculate acceleration for radius animation
		// 반지름 애니메이션을 위한 가속도 계산
		const accel = (this.targetRadius - this.radius) / 2;
		this.radiusV += accel; // Update radius velocity // 반지름 변화 속도 업데이트
		this.radiusV *= BOUNCE; // Apply bounce effect // 반동 효과 적용
		this.radius += this.radiusV; // Update current radius // 현재 반지름 업데이트

		ctx.beginPath();
		ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
		ctx.arc(this.x, this.y, this.radius, 0, PI2, false); // Draw a circle with the current radius // 현재 반지름으로 원 그리기
		ctx.fill(); // Fill the circle with the current fill color // 원을 채우기 색상으로 채우기
	}

	// Reset the dot's state
	// 점의 상태를 초기화하는 메서드
	reset() {
		this.radius = 0; // Reset the radius to 0 // 반지름을 0으로 초기화
		this.radiusV = 0; // Reset the radius velocity to 0 // 반지름 변화 속도를 0으로 초기화
	}
}
