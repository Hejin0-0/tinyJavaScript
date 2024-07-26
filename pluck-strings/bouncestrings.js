import { lineCircle } from "./utils.js";

const BOUNCE = 0.92;

export class BounceString {
	constructor(pos, color) {
		// Calculate the midpoint of the line segment
		// 선분의 중점을 계산함
		const middleX = (pos.x2 - pos.x1) / 2 + pos.x1;
		const middleY = (pos.y2 - pos.y1) / 2 + pos.y1;

		/*
    Initialize the points array with three points:
    - Start point
    - Middle point
    - End point
    Each point has properties for its current position (x, y),
    original position (ox, oy), and velocity (vx, vy).
    */
		/*
    세 개의 점으로 이루어진 points 배열을 초기화함:
    - 시작점
    - 중간점
    - 끝점
    각 점은 현재 위치 (x, y), 원래 위치 (ox, oy), 속도 (vx, vy) 속성을 가짐.
    */
		this.points = [
			{
				x: pos.x1,
				y: pos.y1,
				ox: pos.x1,
				oy: pos.y1,
				vx: 0,
				vy: 0,
			},
			{
				x: middleX,
				y: middleY,
				ox: middleX,
				oy: middleY,
				vx: 0,
				vy: 0,
			},
			{ x: pos.x2, y: pos.y2, ox: pos.x2, oy: pos.y2, vx: 0, vy: 0 },
		];

		// Initialize the detection radius and color
		// 탐지 반경과 색상을 초기화함
		this.detect = 10;
		this.color = color;
	}

	animate(ctx, moveX, moveY) {
		// Draw a circle at the current mouse position
		// 현재 마우스 위치에 원을 그림
		ctx.beginPath();
		ctx.fillStyle = "#ff00ff";
		ctx.arc(moveX, moveY, 20, 0, Math.PI * 2, false);
		ctx.fill();

		// Begin the path for the line
		// 선의 경로를 시작함
		ctx.beginPath();
		ctx.strokeStyle = this.color;
		ctx.lineWidth = 4;

		// Check if the mouse is within the detection radius of the line segment
		// 마우스가 선분의 탐지 반경 내에 있는지 확인함
		if (
			lineCircle(
				this.points[0].x, // 시작점의 x 좌표
				this.points[0].y, // 시작점의 y 좌표
				this.points[2].x, // 끝점의 x 좌표
				this.points[2].y, // 끝점의 y 좌표
				moveX, // 원의 중심 x 좌표
				moveY, // 원의 중심 y 좌표
				this.detect // 원의 반지름

				// 시작점과 끝점 (this.points[0]와 this.points[2])을 사용하여 원과 선분이 교차하는지를 판단.
				// 중간점 (this.points[1])은 이 함수의 판단에 필요하지 않기 때문에 사용되지 않음
			)
		) {
			// If within detection radius, increase the radius and update the velocity
			// 탐지 반경 내에 있으면 반경을 증가시키고 속도를 업데이트
			this.detect = 200; // 1. Update the detection threshold to a higher value.
			// 1. 감지 임계값을 더 높은 값(200)으로 업데이트

			let tx = (this.points[1].ox + moveX) / 2;
			// 2. Calculate the x-coordinate of the new target point, which is the midpoint
			//    between the original point (this.points[1].ox) and the current mouse x position (moveX).
			//    원래의 점 (this.points[1].ox)과 현재 마우스 x 위치 (moveX) 사이의 중간 점의 x 좌표를 계산
			let ty = moveY;
			// 3. Use the current mouse y position as the y-coordinate for the new target point.
			//    현재 마우스 y 위치 (moveY)를 새 목표 점의 y 좌표로 사용
			this.points[1].vx = tx - this.points[1].x;
			// 4. Calculate the velocity in the x direction by subtracting the current x position of point[1]
			//    from the new x target position (tx). This will move point[1] towards the new target position.
			//    현재 x 좌표 (this.points[1].x)에서 새 x 목표 위치 (tx)를 빼서 x 방향의 속도를 계산
			//    이렇게 하면 point[1]이 새로운 목표 위치로 이동합

			this.points[1].vy = ty - this.points[1].y;
			// 5. Calculate the velocity in the y direction by subtracting the current y position of point[1]
			//    from the new y target position (ty). This will move point[1] towards the new target position.
			//    현재 y 좌표 (this.points[1].y)에서 새 y 목표 위치 (ty)를 빼서 y 방향의 속도를 계산
			//    이렇게 하면 point[1]이 새로운 목표 위치로 이동

			/*
            tx는 원래 this.points[1]의 x 좌표 (this.points[1].ox)와 현재 마우스의 x 좌표 (moveX) 사이의 중간 지점을 계산하며 ty는 현재 마우스의 y 좌표 (moveY)로 설정
            */
		} else {
			// If not within detection radius, reset the detection radius and apply bounce effect
			// 탐지 반경 내에 없으면 탐지 반경을 초기화하고 바운스 효과를 적용함
			this.detect = 10;
			let tx = this.points[1].ox;
			let ty = this.points[1].oy;
			this.points[1].vx += tx - this.points[1].x;
			this.points[1].vx *= BOUNCE;
			this.points[1].vy += ty - this.points[1].y;
			this.points[1].vy *= BOUNCE;
		}

		// Update the position of the middle point
		// 중간 점의 위치를 업데이트함
		this.points[1].x += this.points[1].vx;
		this.points[1].y += this.points[1].vy;

		// Draw the quadratic curve from the start point to the end point via the middle point
		// 시작점에서 끝점까지 중간 점을 거쳐 이차 곡선을 그림
		let prevX = this.points[0].x;
		let prevY = this.points[0].y;

		ctx.moveTo(prevX, prevY);

		for (let i = 1; i < this.points.length; i++) {
			const cx = (prevX + this.points[i].x) / 2;
			const cy = (prevY + this.points[i].y) / 2;

			ctx.quadraticCurveTo(prevX, prevY, cx, cy);

			prevX = this.points[i].x;
			prevY = this.points[i].y;
		}

		// Draw the final line to the end point
		// 끝점까지 최종 선을 그림
		ctx.lineTo(prevX, prevY);
		ctx.stroke();
	}
}

/* 
This function checks if a circle (with radius 'r' and center at 'cx', 'cy') intersects a line segment (with endpoints 'x1', 'y1' and 'x2', 'y2'). It returns true if the circle and line segment intersect, and false otherwise.
Function: lineCircle
- Parameters:
  - x1, y1: The coordinates of the first endpoint of the line segment.
  - x2, y2: The coordinates of the second endpoint of the 
*/

/* 
이 함수는 원 (반지름 'r'과 중심 'cx', 'cy')이 선분 (끝점 'x1', 'y1'과 'x2', 'y2')과 교차하는지 확인함. 원과 선분이 교차하면 true를 반환하고 그렇지 않으면 false를 반환함.
함수: lineCircle
- 매개변수:
  - x1, y1: 선분의 첫 번째 끝점의 좌표.
  - x2, y2: 선분의 두 번째 끝점의 좌표.
*/

// quadraticCurveTo 참조: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/quadraticCurveTo
