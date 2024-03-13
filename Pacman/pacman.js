class Pacman {
	constructor(x, y, width, height, speed) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.direction = 4;
		this.nextDirection = 4;
		this.frameCount = 7;
		this.currentFrame = 1;
		setInterval(() => {
			this.changeAnimation();
		}, 100);
	}

	moveProcess() {
		// 유령의 이동 프로세스를 정의하는 메서드
		this.changeDirectionIfPossible(); // 유령의 방향을 변경하는 메서드 호출
		this.moveForwards(); // 현재 방향으로 유령을 이동시키는 메서드 호출
		if (this.checkCollisions()) {
			// 유령의 이동한 위치에 충돌이 있는지 확인
			this.moveBackwards(); // 충돌이 발생한 경우, 유령을 원래 위치로 되돌리는 메서드 호출
			return; // 충돌이 발생하면 이후의 이동 처리를 중단하고 종료
		}
	}

	eat() {
		// 유령이 음식을 먹는 동작을 정의하는 메서드
		for (let i = 0; i < map.length; i++) {
			// 맵을 순회하며 각 행에 대해
			for (let j = 0; j < map[0].length; j++) {
				// 각 열에 대해
				// 현재 위치에 음식이 있고, 유령이 해당 위치에 있는지 확인
				if (
					map[i][j] == 2 && // 현재 셀이 음식을 나타내고
					this.getMapX() == j && // 유령의 x 좌표가 현재 열과 일치하고
					this.getMapY() == i // 유령의 y 좌표가 현재 행과 일치하는 경우
				) {
					// 음식을 먹은 것으로 표시하고, 점수를 증가시킴
					map[i][j] = 3; // 해당 셀의 값을 3으로 변경하여 음식이 없는 상태로 표시
					score++; // 점수를 1점 증가시킴
				}
			}
		}
	}

	moveBackwards() {
		switch (this.direction) {
			case DIRECTION_RIGHT: // Right
				this.x -= this.speed;
				break;
			case DIRECTION_UP: // Up
				this.y += this.speed;
				break;
			case DIRECTION_LEFT: // Left
				this.x += this.speed;
				break;
			case DIRECTION_BOTTOM: // Bottom
				this.y -= this.speed;
				break;
		}
	}

	moveForwards() {
		switch (this.direction) {
			case DIRECTION_RIGHT: // Right
				this.x += this.speed;
				break;
			case DIRECTION_UP: // Up
				this.y -= this.speed;
				break;
			case DIRECTION_LEFT: // Left
				this.x -= this.speed;
				break;
			case DIRECTION_BOTTOM: // Bottom
				this.y += this.speed;
				break;
		}
	}

	checkCollisions() {
		// 유령의 충돌 여부를 확인하는 메서드
		let isCollided = false; // 충돌 여부 초기화
		if (
			map[parseInt(this.y / oneBlockSize)][
				parseInt(this.x / oneBlockSize)
			] == 1 || // 유령의 현재 위치의 셀이 벽인 경우
			map[parseInt(this.y / oneBlockSize + 0.9999)][
				parseInt(this.x / oneBlockSize)
			] == 1 || // 유령의 아래쪽 좌표가 벽과 충돌하는 경우
			map[parseInt(this.y / oneBlockSize)][
				parseInt(this.x / oneBlockSize + 0.9999)
			] == 1 || // 유령의 오른쪽 좌표가 벽과 충돌하는 경우
			map[parseInt(this.y / oneBlockSize + 0.9999)][
				parseInt(this.x / oneBlockSize + 0.9999)
			] == 1 // 유령의 오른쪽 아래 좌표가 벽과 충돌하는 경우
		) {
			isCollided = true; // 충돌이 발생한 경우 true로 설정
		}
		return isCollided; // 충돌 여부 반환
	}

	checkGhostCollision(ghosts) {
		// 유령과 유령과의 충돌 여부를 확인하는 메서드
		for (let i = 0; i < ghosts.length; i++) {
			// 유령 배열을 순회하면서
			let ghost = ghosts[i]; // 현재 유령 객체를 가져옴
			if (
				ghost.getMapX() == this.getMapX() && // 유령이 동일한 x 좌표에 있는지 확인하고
				ghost.getMapY() == this.getMapY() // 유령이 동일한 y 좌표에 있는지 확인
			) {
				return true; // 충돌이 발생한 경우 true 반환
			}
		}
		return false; // 충돌이 발생하지 않은 경우 false 반환
	}

	changeDirectionIfPossible() {
		// 유령의 다음 이동 방향이 유효한지 확인하고 변경. 만약 변경한 방향으로 이동했을 때 충돌이 발생하면 이전 방향으로 복구
		if (this.direction == this.nextDirection) return; // 현재 방향이 다음 방향과 동일한 경우 변경하지 않음
		let tempDirection = this.direction; // 현재 방향을 임시 변수에 저장
		this.direction = this.nextDirection; // 현재 방향을 다음 방향으로 변경
		this.moveForwards(); // 현재 방향으로 한 칸 이동
		if (this.checkCollisions()) {
			// 이동한 위치에 충돌이 발생한 경우
			this.moveBackwards(); // 이동을 취소하고 원래 위치로 되돌림
			this.direction = tempDirection; // 방향을 이전 방향으로 복원
		} else {
			this.moveBackwards(); // 충돌이 발생하지 않은 경우 이동을 취소하고 원래 위치로 되돌림
		}
	}

	getMapX() {
		// 유령의 x 좌표에 해당하는 맵 상의 열 인덱스를 반환하는 메서드
		let mapX = parseInt(this.x / oneBlockSize); // 유령의 x 좌표를 블록 크기로 나눈 후 정수로 변환하여 맵 상의 열 인덱스 계산
		return mapX; // 계산된 열 인덱스 반환
	}

	getMapY() {
		// 유령의 y 좌표에 해당하는 맵 상의 행 인덱스를 반환하는 메서드
		let mapY = parseInt(this.y / oneBlockSize); // 유령의 y 좌표를 블록 크기로 나눈 후 정수로 변환하여 맵 상의 행 인덱스 계산
		return mapY; // 계산된 행 인덱스 반환
	}

	getMapXRightSide() {
		// 유령의 x 좌표 오른쪽 경계에 해당하는 맵 상의 열 인덱스를 반환하는 메서드
		let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize); // 유령의 x 좌표 오른쪽 경계를 계산하고 블록 크기로 나눈 후 정수로 변환하여 맵 상의 열 인덱스 계산
		return mapX; // 계산된 열 인덱스 반환
	}

	getMapYRightSide() {
		// 유령의 y 좌표 아래쪽 경계에 해당하는 맵 상의 행 인덱스를 반환하는 메서드
		let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize); // 유령의 y 좌표 아래쪽 경계를 계산하고 블록 크기로 나눈 후 정수로 변환하여 맵 상의 행 인덱스 계산
		return mapY; // 계산된 행 인덱스 반환
	}

	changeAnimation() {
		// 유령의 애니메이션 프레임을 변경하는 메서드
		this.currentFrame =
			this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1; // 현재 프레임이 마지막 프레임인 경우 첫 번째 프레임으로, 그렇지 않은 경우 다음 프레임으로 변경
	}

	draw() {
		// 팩맨을 화면에 그리는 메서드
		ctx.save(); // 현재 그래픽 상태를 저장
		ctx.translate(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2); // 회전 중심점을 팩맨의 중심으로 이동
		ctx.rotate((this.direction * 90 * Math.PI) / 180); // 팩맨을 이동 방향으로 회전
		ctx.translate(-this.x - oneBlockSize / 2, -this.y - oneBlockSize / 2); // 회전 후 다시 이동 중심점을 원래 위치로 되돌림
		ctx.drawImage(
			// 이미지를 그림
			pacmanFrames, // 팩맨 이미지 소스
			(this.currentFrame - 1) * oneBlockSize, // 현재 애니메이션 프레임의 x 좌표
			0, // 이미지의 y 좌표
			oneBlockSize, // 이미지의 너비
			oneBlockSize, // 이미지의 높이
			this.x, // 화면에 그릴 x 좌표
			this.y, // 화면에 그릴 y 좌표
			this.width, // 팩맨의 너비
			this.height // 팩맨의 높이
		);
		ctx.restore(); // 저장된 그래픽 상태를 복원하여 회전 및 이동 변환을 취소
	}
}
