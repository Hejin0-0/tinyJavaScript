import { distance } from "./utils.js";

export class Ripple {
	constructor() {
		this.x = 0; // X-coordinate of the ripple's center // 파문의 중심 X 좌표
		this.y = 0; // Y-coordinate of the ripple's center // 파문의 중심 Y 좌표
		this.radius = 0; // Current radius of the ripple // 현재 파문의 반지름
		this.maxRadius = 0; // Maximum radius of the ripple // 파문의 최대 반지름
		this.speed = 10; // Speed at which the ripple expands // 파문이 확장되는 속도
	}

	// Resize the ripple effect to fit the stage dimensions
	// 스테이지 크기에 맞게 파문 효과를 조정
	resize(stageWidth, stageHeight) {
		this.stageWidth = stageWidth; // Stage width // 스테이지 너비
		this.stageHeight = stageHeight; // Stage height // 스테이지 높이
	}

	// Start the ripple effect at a given position
	// 주어진 위치에서 파문 효과를 시작
	start(x, y) {
		this.x = x; // Set the center X-coordinate of the ripple // 파문의 중심 X 좌표 설정
		this.y = y; // Set the center Y-coordinate of the ripple // 파문의 중심 Y 좌표 설정
		this.radius = 0; // Reset the radius to 0 // 반지름을 0으로 초기화
		this.maxRadius = this.getMax(x, y); // Calculate the maximum radius based on the ripple's position // 파문의 위치에 따라 최대 반지름 계산
	}

	// Animate the ripple effect
	// 파문 효과 애니메이션
	animate(ctx) {
		if (this.radius < this.maxRadius) {
			// Check if the ripple has not reached its maximum size // 파문이 최대 크기에 도달하지 않았는지 확인
			this.radius += this.speed; // Increase the radius by the speed value // 반지름을 속도만큼 증가시킴
		}

		ctx.beginPath(); // Begin a new path for the ripple // 파문을 그리기 위해 새로운 경로 시작
		ctx.fillStyle = "#00ff00"; // Set the fill color to green // 채우기 색상을 초록색으로 설정
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false); // Draw a circle with the current radius // 현재 반지름으로 원 그리기
		ctx.fill(); // Fill the circle with the specified color // 원을 색상으로 채우기
	}

	// Calculate the maximum radius based on the distance to the corners of the stage
	// 스테이지의 모서리까지의 거리 기반으로 최대 반지름 계산
	getMax(x, y) {
		const c1 = distance(0, 0, x, y); // Distance to top-left corner // 왼쪽 상단 모서리까지의 거리
		const c2 = distance(this.stageWidth, 0, x, y); // Distance to top-right corner // 오른쪽 상단 모서리까지의 거리
		const c3 = distance(0, this.stageHeight, x, y); // Distance to bottom-left corner // 왼쪽 하단 모서리까지의 거리
		const c4 = distance(this.stageWidth, this.stageHeight, x, y); // Distance to bottom-right corner // 오른쪽 하단 모서리까지의 거리
		return Math.max(c1, c2, c3, c4); // Return the maximum distance as the maximum radius // 최대 반지름으로 최대 거리를 반환
	}
}

/*
Related Code Explanation:
- In `app.js`, the `Ripple` class is used to create a ripple effect centered at the position where the user clicks. This is achieved by calling `this.ripple.start(e.offsetX, e.offsetY)` when a click event occurs.
- In `dot.js`, the `Ripple` effect can trigger animations on `Dot` objects if they collide with the expanding ripple. The collision detection is handled in the `animate` method of the `App` class.

app.js에서의 사용:
    App 클래스에서 Ripple 객체는 this.ripple로 참조되며, 사용자가 클릭할 때마다 this.ripple.start(e.offsetX, e.offsetY)를 호출하여 파문 효과를 시작.

dot.js와의 연관성:
    Ripple 효과가 활성화되면, App 클래스의 animate 메서드에서 Ripple과 Dot 객체 간의 충돌을 감지하고, 충돌이 발생한 Dot 객체를 애니메이션.

References:
- `arc()` method documentation: [MDN Web Docs: CanvasRenderingContext2D.arc()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc)
*/
