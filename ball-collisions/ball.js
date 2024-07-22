export class Ball {
	constructor(stageWidth, stageHeight, radius, speed) {
		this.radius = radius; // 공의 반지름
		this.vx = speed; // 공의 수평 속도
		this.vy = speed; // 공의 수직 속도

		const diameter = this.radius * 2; // 공의 지름

		this.x = this.radius + Math.random() * (stageWidth - diameter); // 공의 초기 x 위치
		this.y = this.radius + Math.random() * (stageHeight - diameter); // 공의 초기 y 위치
		// x, y를 '반지름'에서 '화면 사이즈 - 반지름' 사이에 랜덤값으로 놓겠다
	}

	draw(ctx, stageWidth, stageHeight, block) {
		this.x += this.vx; // 공의 x 위치를 속도만큼 이동
		this.y += this.vy; // 공의 y 위치를 속도만큼 이동

		this.bounceWindow(stageWidth, stageHeight); // 공이 화면의 경계에서 튕기도록 처리
		this.bounceBlock(block); // 공이 블록과 충돌 시 튕기도록 처리

		ctx.fillStyle = "#fdd700"; // 공의 색상을 노란색으로 설정
		ctx.beginPath(); // 새 경로를 시작
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); // 공을 그리기 위한 원을 설정
		ctx.fill(); // 설정된 경로를 채워서 공을 그립니다.
	}

	bounceWindow(stageWidth, stageHeight) {
		const minX = this.radius; // 공이 화면의 왼쪽 경계에 닿을 수 있는 최소 x 값
		const maxX = stageWidth - this.radius; // 공이 화면의 오른쪽 경계에 닿을 수 있는 최대 x 값
		const minY = this.radius; // 공이 화면의 위쪽 경계에 닿을 수 있는 최소 y 값
		const maxY = stageHeight - this.radius; // 공이 화면의 아래쪽 경계에 닿을 수 있는 최대 y 값

		if (this.x <= minX || this.x >= maxX) {
			// 공이 화면의 수평 경계에 닿았는지 확인
			this.vx *= -1; // 수평 속도를 반전
			this.x += this.vx; // 속도만큼 위치 조정
		} else if (this.y <= minY || this.y >= maxY) {
			// 공이 화면의 수직 경계에 닿았는지 확인
			this.vy *= -1; // 수직 속도를 반전
			this.y += this.vy; // 속도만큼 위치 조정
		}
	}

	bounceBlock(block) {
		const minX = block.x - this.radius; // 블록의 왼쪽 경계
		const maxX = block.maxX + this.radius; // 블록의 오른쪽 경계
		const minY = block.y - this.radius; // 블록의 위쪽 경계
		const maxY = block.maxY + this.radius; // 블록의 아래쪽 경계

		if (this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
			// 공이 블록의 영역에 있는지 확인
			const x1 = Math.abs(minX - this.x); // 공의 x 위치와 블록 왼쪽 경계 사이의 거리
			const x2 = Math.abs(this.x - maxX); // 공의 x 위치와 블록 오른쪽 경계 사이의 거리
			const y1 = Math.abs(minY - this.y); // 공의 y 위치와 블록 위쪽 경계 사이의 거리
			const y2 = Math.abs(this.y - maxY); // 공의 y 위치와 블록 아래쪽 경계 사이의 거리
			const min1 = Math.min(x1, x2); // 수평 거리 중 최소값
			const min2 = Math.min(y1, y2); // 수직 거리 중 최소값
			const min = Math.min(min1, min2); // 최소 거리 중 최소값

			if (min == min1) {
				// 수평 거리 중 최소값이 충돌 방향으로 결정되면
				this.vx *= -1; // 수평 속도를 반전
				this.x += this.vx; // 속도만큼 위치 조정
			} else if (min == min2) {
				// 수직 거리 중 최소값이 충돌 방향으로 결정되면
				this.vy *= -1; // 수직 속도를 반전
				this.y += this.vy; // 속도만큼 위치 조정
			}
		}
	}
}
