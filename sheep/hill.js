export class Hill {
	constructor(color, speed, total) {
		this.color = color;
		this.speed = speed;
		this.total = total;
	}

	resize(stageWidth, stageHeight) {
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		this.points = [];
		this.gap = Math.ceil(this.stageWidth / (this.total - 2));
		// Calculate the gap between points
		// 점 사이의 간격을 계산

		for (let i = 0; i < this.total; i++) {
			this.points[i] = {
				x: i * this.gap,
				// Set the x position of the point
				// 점의 x 위치를 설정
				y: this.getY(),
				// Set the y position of the point using getY method
				// getY 메서드를 사용하여 점의 y 위치를 설정
			};
		}
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();

		let cur = this.points[0];
		// Get the first point
		// 첫 번째 점을 가져옴
		// current의 약자로 현재 점(current point)
		let prev = cur;
		// Set the previous point as the current point
		// 이전 점을 현재 점으로 설정
		// previous의 약자로 이전 점(previous point)

		let dots = [];
		cur.x += this.speed;
		// Move the current point by the hill's speed
		// 언덕의 속도로 현재 점을 이동

		if (cur.x > -this.gap) {
			// Check if the current point is within the visible area
			// 현재 점이 가시 영역 내에 있는지 확인
			this.points.unshift({
				x: -(this.gap * 2),
				// Add a new point at the beginning
				// 시작 부분에 새 점을 추가
				y: this.getY(),
				// Set the y position of the new point using getY method
				// getY 메서드를 사용하여 새 점의 y 위치를 설정
			});
		} else if (cur.x > this.stageWidth + this.gap) {
			// Check if the current point is outside the visible area
			// 현재 점이 가시 영역 밖에 있는지 확인
			this.points.splice(-1);
			// Remove the last point
			// 마지막 점을 제거
		}

		ctx.moveTo(cur.x, cur.y);

		let prevCx = cur.x;
		// Set the previous control point x position
		// 이전 제어점 x 위치를 설정
		let prevCy = cur.y;
		// Set the previous control point y position
		// 이전 제어점 y 위치를 설정

		for (let i = 1; i < this.points.length; i++) {
			cur = this.points[i];
			// Get the current point
			// 현재 점을 가져옴
			cur.x += this.speed;
			// Move the current point by the hill's speed
			// 언덕의 속도로 현재 점을 이동

			const cx = (prev.x + cur.x) / 2;
			// Calculate the control point x position
			// 제어점 x 위치를 계산
			// control point x의 약자로 베지어 곡선의 제어점의 x 좌표
			const cy = (prev.y + cur.y) / 2;
			// Calculate the control point y position
			// 제어점 y 위치를 계산
			// control point y의 약자로 베지어 곡선의 제어점의 y 좌표
			ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);
			// Draw a quadratic curve
			// 2차 곡선

			dots.push({
				// 각 점의 위치를 저장하여 나중에 양(sheep) 객체가 이 경로를 따라 움직일 수 있도록 하기 위함
				x1: prevCx,
				y1: prevCy,
				x2: prev.x,
				y2: prev.y,
				x3: cx,
				y3: cy,
			});

			prev = cur;
			prevCx = cx;
			prevCy = cy;
		}

		ctx.lineTo(prev.x, prev.y);
		ctx.lineTo(this.stageWidth, this.stageHeight);
		// Draw a line to the bottom-right corner of the stage
		// 무대의 오른쪽 하단 모서리로 선을 그림
		ctx.lineTo(this.points[0].x, this.stageHeight);
		// Draw a line to the bottom-left corner of the stage
		// 무대의 왼쪽 하단 모서리로 선을 그림
		ctx.fill();

		return dots;
	}

	getY() {
		const min = this.stageHeight / 8;
		const max = this.stageHeight - min;
		return min + Math.random() * max;
	}
}

/* 관련 MDN Web Docs 링크:
   1. Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor
   2. Array.prototype.unshift: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
   3. Array.prototype.splice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
   4. CanvasRenderingContext2D.quadraticCurveTo: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo
*/
