const PI2 = Math.PI * 2;

export class Ball {
	constructor(stageWidth, stageHeight, radius, speed) {
		this.radius = radius; // Radius of the ball ... 공의 반지름
		this.vx = speed; // Velocity in the x direction ... x 방향 속도
		this.vy = speed; // Velocity in the y direction ... y 방향 속도
		this.x = stageWidth / 2; // Initial x position ... 초기 x 위치
		this.y = stageHeight / 2; // Initial y position ... 초기 y 위치
	}

	/* Animate the ball's movement */
	/* 공의 움직임을 애니메이트함 */
	animate(ctx, stageWidth, stageHeight) {
		/* Update the ball's position */
		/* 공의 위치를 업데이트함 */
		this.x += this.vx;
		this.y += this.vy;

		/* Define the boundaries for the ball's movement */
		/* 공의 움직임에 대한 경계를 정의함 */
		const minX = this.radius;
		const maxX = stageWidth - this.radius;
		const minY = this.radius;
		const maxY = stageHeight - this.radius;

		/* Reverse the ball's x direction if it hits the horizontal boundaries */
		/* 공이 수평 경계에 닿으면 x 방향을 반전함 */
		if (this.x <= minX || this.x >= maxX) {
			this.vx *= -1;
		}
		/* Reverse the ball's y direction if it hits the vertical boundaries */
		/* 공이 수직 경계에 닿으면 y 방향을 반전함 */
		if (this.y <= minY || this.y >= maxY) {
			this.vy *= -1;
		}

		/* Draw the ball on the canvas */
		/* 캔버스에 공을 그림 */
		ctx.fillStyle = "#ffdd1c";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, PI2);
		ctx.fill();
	}
}

/* Related MDN Web Docs */
/* 관련된 MDN 웹 문서 */
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill
