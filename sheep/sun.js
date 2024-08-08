export class Sun {
	constructor() {
		this.radius = 200;
		// The radius of the circle on which points are distributed
		// 점들이 분포하는 원의 반지름

		this.total = 60;
		// The total number of points to be distributed around the circle
		// 원 주위에 분포할 점들의 총 개수

		this.gap = 1 / this.total;
		// The gap between points, defined as a fraction of the circle (used for positioning)
		// 점들 사이의 간격을 원의 비율로 정의 (위치 지정에 사용됨)

		this.originPos = [];
		this.pos = [];
		// Arrays to store the original positions and current positions of points
		// 점들의 원래 위치와 현재 위치를 저장할 배열

		for (let i = 0; i < this.total; i++) {
			const pos = this.getCirclePoint(this.radius, this.gap * i);
			// Calculate the position of a point on the circle based on the radius and angle
			// 반지름과 각도에 기반하여 원 위의 점의 위치 계산

			this.originPos[i] = pos;
			// Store the calculated position in the originPos array
			// 계산된 위치를 originPos 배열에 저장

			this.pos[i] = pos;
			// Store the same position in the pos array, which will be used for drawing
			// 동일한 위치를 pos 배열에 저장, 이는 그리기에 사용될 것임
		}

		// Initialize the positions of all points around the circle
		// 원 주위의 모든 점들의 위치를 초기화

		this.fps = 30;
		// Frames per second for updating the sun's appearance
		// 태양의 외형을 업데이트할 초당 프레임 수

		this.fpsTime = 1000 / this.fps;
		// Time in milliseconds between each frame update
		// 각 프레임 업데이트 사이의 시간 (밀리초)
	}

	resize(stageWidth, stageHeight) {
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		this.x = this.stageWidth - this.radius - 140;
		this.y = this.radius + 100;
		// Set the position of the sun based on the new stage size
		// 새 무대 크기에 기반하여 태양의 위치 설정
	}

	draw(ctx, t) {
		if (!this.time) {
			this.time = t;
			// Initialize the time variable to the current time if it's not set
			// 시간이 설정되지 않은 경우 현재 시간으로 초기화
		}

		const now = t - this.time;
		// Calculate the time elapsed since the last frame
		// 마지막 프레임 이후 경과된 시간 계산

		if (now > this.fpsTime) {
			this.time = t;
			// Update the time to the current time for the next frame
			// 다음 프레임을 위해 시간을 현재 시간으로 업데이트

			this.updatePoints();
			// Update the positions of the points to create a twinkling effect
			// 점들의 위치를 업데이트하여 반짝이는 효과 생성
		}

		ctx.fillStyle = "#ffb200";

		ctx.beginPath();

		let pos = this.pos[0];
		ctx.moveTo(pos.x + this.x, pos.y + this.y);
		// Move to the initial point of the sun's shape
		// 태양의 모양의 초기 점으로 이동

		for (let i = 1; i < this.total; i++) {
			// 태양의 외곽 경로를 그리는 데 사용
			// i = 0은 이미 ctx.moveTo로 시작된 지점이기 때문에, 이 반복문에서는 첫 번째 점을 제외하고 나머지 점들만 처리
			const pos = this.pos[i];
			// Retrieve the position of the current point from the pos array
			// 현재 점의 위치를 pos 배열에서 가져옴

			ctx.lineTo(pos.x + this.x, pos.y + this.y);
			// Draw a line to the current point's position
			// 현재 점의 위치까지 선을 그림
			// 여기서 pos.x와 pos.y는 점의 상대적인 위치, this.x와 this.y는 태양의 위치
		}

		ctx.fill();
	}

	updatePoints() {
		for (let i = 1; i < this.total; i++) {
			// Start looping from the second point to the last
			// 두 번째 점부터 마지막 점까지 반복

			const pos = this.originPos[i];
			// Retrieve the original position of the current point from the originPos array
			// originPos 배열에서 현재 점의 원래 위치를 가져옴

			this.pos[i] = {
				x: pos.x + this.ranInt(5),
				y: pos.y + this.ranInt(5),
			};
			// Update the current point's position by adding a random offset
			// 현재 점의 위치를 무작위 오프셋을 추가하여 업데이트
			// ranInt(5)는 -5와 5 사이의 무작위 정수를 반환
		}
	}

	ranInt(max) {
		return Math.random() * max;
		// Generate a random number between 0 and the specified max value
		// 0과 지정된 최대 값 사이의 임의의 숫자 생성
	}

	getCirclePoint(radius, t) {
		const theta = Math.PI * 2 * t;
		// Calculate the angle in radians based on the fraction of the circle
		// 원의 비율에 기반하여 각도 계산 (라디안 단위)

		return {
			x: Math.cos(theta) * radius,
			y: Math.sin(theta) * radius,
			// Calculate the x and y coordinates of the point on the circle
			// 원 위의 점의 x 및 y 좌표 계산
		};
	}
}

/*
	CanvasRenderingContext2D.fill: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fill
*/
