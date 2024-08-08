export class Sheep {
	constructor(img, stageWidth) {
		this.img = img;

		this.totalFrame = 8;
		this.curFrame = 0;
		// Current frame index
		// 현재 프레임 인덱스

		this.imgWidth = 360;
		// Width of each frame in the sprite sheet
		// 스프라이트 시트에서 각 프레임의 너비
		this.imgHeight = 300;
		// Height of each frame in the sprite sheet
		// 스프라이트 시트에서 각 프레임의 높이

		this.sheepWidth = 180;
		this.sheepHeight = 150;

		this.sheepWidthHalf = this.sheepWidth / 2;
		this.x = stageWidth + this.sheepWidth;
		// Initial x position of the sheep (off-screen to the right)
		// 양의 초기 x 위치(오른쪽 화면 밖)
		this.y = 0;
		// Initial y position of the sheep
		// 양의 초기 y 위치
		this.speed = Math.random() * 2 + 1;
		// Random speed of the sheep
		// 양의 무작위 속도

		this.fps = 24;
		this.fpsTime = 1000 / this.fps;
	}

	draw(ctx, t, dots) {
		if (!this.time) {
			this.time = t;
			// Initialize the time if it is not set
			// 시간이 설정되지 않은 경우(즉, 첫 번째 호출 시) 초기화
			// 이를 통해 애니메이션 프레임을 관리하기 위한 기준점을 설정
		}

		const now = t - this.time;
		// Calculate the time difference
		// 현재 시간 t와 이전 시간 this.time의 차이를 계산. 이 차이는 프레임이 변경될 때까지의 경과 시간
		if (now > this.fpsTime) {
			// 경과 시간이 설정된 프레임 시간 this.fpsTime보다 크면 (즉, 애니메이션의 다음 프레임으로 넘어갈 시간이라면) 프레임을 업데이트
			this.time = t;
			// Reset the time
			// 시간을 리셋
			this.curFrame += 1;
			// Move to the next frame
			// 다음 프레임으로 이동
			if (this.curFrame == this.totalFrame) {
				this.curFrame = 0;
				// Reset the frame index if it exceeds the total frames
				// 총 프레임 수를 초과하면 프레임 인덱스를 리셋
			}
		}

		this.animate(ctx, dots);
		// Call the animate method to update the sheep's position and draw it
		// 양의 위치를 업데이트하고 그리기 위해 animate 메서드를 호출
	}

	animate(ctx, dots) {
		this.x -= this.speed;
		// Move the sheep to the left by its speed
		// 양을 speed만큼 왼쪽으로 이동
		const closest = this.getY(this.x, dots);
		// Get the closest point on the path
		// 경로상의 가장 가까운 점을 가져옴
		this.y = closest.y;
		// Set the sheep's y position to the closest point's y
		// 양의 y 위치를 가장 가까운 점의 y로 설정

		ctx.save();
		// Save the current drawing state
		// 현재 그리기 상태를 저장
		ctx.translate(this.x, this.y);
		// Move the canvas origin to the sheep's position
		// 캔버스의 원점을 양의 위치로 이동
		ctx.rotate(closest.rotation);
		// Rotate the canvas to match the path's angle
		// 경로의 각도에 맞게 캔버스를 회전
		ctx.drawImage(
			this.img,
			this.imgWidth * this.curFrame,
			0,
			this.imgWidth,
			this.imgHeight,
			-this.sheepWidthHalf,
			-this.sheepHeight + 20,
			this.sheepWidth,
			this.sheepHeight
			/*
				이미지 객체 (this.img)를 사용하여 현재 프레임의 일부를 자름.
				자를 영역의 크기 (this.imgWidth, this.imgHeight)를 설정.
				프레임 위치 (this.imgWidth * this.curFrame)를 지정하여 현재 프레임의 시작 위치를 결정.
				캔버스에서 이미지의 위치는 -this.sheepWidthHalf (x좌표)와 -this.sheepHeight + 20 (y좌표)로 조정.
				이를 통해 이미지가 적절한 위치에 맞춰지며, 양의 너비(this.sheepWidth)와 높이(this.sheepHeight)를 고려하여 그림.
			*/
		);
		ctx.restore(); // Restore the drawing state
		// 그리기 상태를 복원
	}

	getY(x, dots) {
		for (let i = 1; i < dots.length; i++) {
			if (x >= dots[i].x1 && x <= dots[i].x3) {
				// Check if x is within the current segment
				// x가 현재 세그먼트 내에 있는지 확인
				return this.getY2(x, dots[i]); // Get the y position on the quadratic curve
				// 2차 곡선의 y 위치를 가져
			}
		}

		return {
			y: 0,
			// Default y position
			// 기본 y 위치
			rotation: 0,
			// Default rotation
			// 기본 회전 값
		};
	}

	getY2(x, dot) {
		const total = 200;
		// Number of segments to divide the curve into
		// 곡선을 나눌 세그먼트 수
		let pt = this.getPointOnQuad(
			dot.x1,
			dot.y1,
			dot.x2,
			dot.y2,
			dot.x3,
			dot.y3,
			0
		);
		// Initial point on the quadratic curve
		// 2차 곡선의 초기 점
		let prevX = pt.x;
		// Previous x position
		// 이전 x 위치
		for (let i = 1; i < total; i++) {
			// Loop through the segments
			// 세그먼트를 순회
			const t = i / total;
			// Calculate the parameter t for the current segment
			// 현재 세그먼트의 매개변수 t를 계산
			pt = this.getPointOnQuad(
				dot.x1,
				dot.y1,
				dot.x2,
				dot.y2,
				dot.x3,
				dot.y3,
				t
			);
			// Get the point on the quadratic curve
			// 2차 곡선의 점을 가져

			if (x >= prevX && x <= pt.x) {
				// Check if x is within the current segment
				// x가 현재 세그먼트 내에 있는지 확인
				return pt;
				// Return the point
				// 점을 반환
			}
			prevX = pt.x;
			// Update the previous x position
			// 이전 x 위치를 업데이트
		}
		return pt;
		// Return the last point if no segment matches
		// 일치하는 세그먼트가 없으면 마지막 점을 반환
	}

	getQuadValue(p0, p1, p2, t) {
		return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
		// Calculate the quadratic value at parameter t
		// 매개변수 t에서 2차 값을 계산
	}

	getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
		const tx = this.quadTangent(x1, x2, x3, t);
		// Calculate the tangent in x direction
		// x 방향의 접선을 계산
		const ty = this.quadTangent(y1, y2, y3, t);
		// Calculate the tangent in y direction
		// y 방향의 접선을 계산
		const rotation = -Math.atan2(tx, ty) + (90 * Math.PI) / 180;
		// Calculate the rotation angle
		// 회전 각도를 계산
		return {
			x: this.getQuadValue(x1, x2, x3, t),
			// Calculate the x position on the quadratic curve
			// 2차 곡선의 x 위치를 계산
			y: this.getQuadValue(y1, y2, y3, t),
			// Calculate the y position on the quadratic curve
			// 2차 곡선의 y 위치를 계산
			rotation: rotation,
			// Set the rotation
			// 회전을 설정
		};
	}

	quadTangent(a, b, c, t) {
		return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
		// Calculate the tangent at parameter t
		// 매개변수 t에서 접선을 계산
	}
}

/*
	JavaScript - MDN Web Docs:
	- Image: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
	- requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web
	- CanvasRenderingContext2D.drawImage: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
*/
