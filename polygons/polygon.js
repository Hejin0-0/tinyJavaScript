const PI2 = Math.PI * 2;

const COLORS = [
	"#4b45ab",
	"#554fb8",
	"#605ac7",
	"#2a91a8",
	"#2e9ab2",
	"#32a5bf",
	"#81b144",
	"#85b944",
	"#8fc549",
	"#e0af27",
	"#eeba2a",
	"#fec72e",
	"#bf342d",
	"#ca3931",
	"#d7423a",
];

export class Polygon {
	constructor(x, y, radius, sides) {
		this.x = x;
		// The x-coordinate of the polygon's center
		// 다각형 중심의 x 좌표

		this.y = y;
		// The y-coordinate of the polygon's center
		// 다각형 중심의 y 좌표

		this.radius = radius;
		// The radius of the polygon
		// 다각형의 반지름

		this.sides = sides;
		// The number of sides of the polygon
		// 다각형의 변 수

		this.rotate = 0;
		// The initial rotation angle of the polygon
		// 다각형의 초기 회전 각도
	}

	animate(ctx, moveX) {
		ctx.save();
		// Save the current drawing state
		// 현재 그리기 상태를 저장

		const angle = PI2 / this.sides;
		// Calculate the angle between each side of the polygon
		// 다각형의 각 변 사이의 각도를 계산

		const angle2 = PI2 / 4;
		// Calculate the angle for the inner shapes (squares)
		// 내부 도형(사각형)의 각도를 계산

		ctx.translate(this.x, this.y);
		// Move the canvas origin to the polygon's center
		// 캔버스 원점을 다각형의 중심으로 이동

		this.rotate += moveX * 0.008;
		// Increment the rotation angle based on the moveX value
		// moveX 값에 따라 회전 각도를 증가

		ctx.rotate(this.rotate);
		// Apply the rotation to the context
		// 컨텍스트에 회전을 적용

		for (let i = 0; i < this.sides; i++) {
			const x = this.radius * Math.cos(angle * i);
			// Calculate the x-coordinate of the current vertex
			// 현재 꼭짓점의 x 좌표를 계산

			const y = this.radius * Math.sin(angle * i);
			// Calculate the y-coordinate of the current vertex
			// 현재 꼭짓점의 y 좌표를 계산

			ctx.save();
			// Save the current state before drawing the inner shape
			// 내부 도형을 그리기 전에 현재 상태를 저장

			ctx.fillStyle = COLORS[i];

			ctx.translate(x, y);
			// Move the context to the current vertex position
			// 컨텍스트를 현재 꼭짓점 위치로 이동

			ctx.rotate((((360 / this.sides) * i + 45) * Math.PI) / 180);
			// Rotate the context to align the inner shape correctly
			// 내부 도형을 올바르게 정렬하도록 컨텍스트를 회전

			ctx.beginPath();
			// Start a new path for the inner shape (square)
			// 내부 도형(사각형)을 위한 새로운 경로를 시작

			for (let j = 0; j < 4; j++) {
				// Loop to draw the four sides of the inner square
				// 내부 사각형의 네 변을 그리기 위한 루프

				const x2 = 160 * Math.cos(angle2 * j);
				// Calculate the x-coordinate for the square vertex
				// 사각형 꼭짓점의 x 좌표를 계산

				const y2 = 160 * Math.sin(angle2 * j);
				// Calculate the y-coordinate for the square vertex
				// 사각형 꼭짓점의 y 좌표를 계산

				j == 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
				// Move to the first vertex or draw a line to subsequent vertices
				// 첫 번째 꼭짓점으로 이동하거나 후속 꼭짓점까지 선을 그람
			}

			ctx.fill();
			ctx.closePath();

			ctx.restore();
			// Restore the previous context state
			// 이전 컨텍스트 상태를 복원
		}

		ctx.restore();
		// Restore the original drawing state
		// 원래의 그리기 상태를 복원
	}
}
