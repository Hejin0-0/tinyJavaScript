class Ghost {
	constructor(
		x,
		y,
		width,
		height,
		speed,
		imageX,
		imageY,
		imageWidth,
		imageHeight,
		range
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.direction = DIRECTION_RIGHT;
		this.imageX = imageX;
		this.imageY = imageY;
		this.imageHeight = imageHeight;
		this.imageWidth = imageWidth;
		this.range = range;
		this.randomTargetIndex = parseInt(Math.random() * 4);
		this.target = randomTargetsForGhosts[this.randomTargetIndex];
		setInterval(() => {
			this.changeRandomDirection();
		}, 10000);
	}

	isInRange() {
		// 팩맨과 고스트 사이의 거리가 고스트의 사거리 이내에 있는지 확인하는 메서드
		let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
		let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
		if (
			Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
			this.range
		) {
			return true;
		}
		return false;
	}

	changeRandomDirection() {
		// 무작위 방향을 변경하는 메서드
		let addition = 1;
		this.randomTargetIndex += addition;
		this.randomTargetIndex = this.randomTargetIndex % 4;
	}

	moveProcess() {
		// 고스트의 움직임을 처리하는 메서드
		if (this.isInRange()) {
			// 고스트와 팩맨이 가까이 있으면
			this.target = pacman; // 고스트의 목표를 팩맨으로 설정
		} else {
			this.target = randomTargetsForGhosts[this.randomTargetIndex]; // 그렇지 않으면 무작위 목표 설정
		}
		this.changeDirectionIfPossible(); // 가능한 경우 방향을 변경
		this.moveForwards(); // 앞으로 이동
		if (this.checkCollisions()) {
			// 충돌 확인
			this.moveBackwards(); // 충돌이 발생하면 뒤로 이동
			return;
		}
	}

	moveBackwards() {
		switch (this.direction) {
			case 4: // Right
				this.x -= this.speed;
				break;
			case 3: // Up
				this.y += this.speed;
				break;
			case 2: // Left
				this.x += this.speed;
				break;
			case 1: // Bottom
				this.y -= this.speed;
				break;
		}
	}

	moveForwards() {
		switch (this.direction) {
			case 4: // Right
				this.x += this.speed;
				break;
			case 3: // Up
				this.y -= this.speed;
				break;
			case 2: // Left
				this.x -= this.speed;
				break;
			case 1: // Bottom
				this.y += this.speed;
				break;
		}
	}

	checkCollisions() {
		// 충돌을 확인하는 메서드
		let isCollided = false;
		// 현재 위치의 맵 요소가 벽인지 확인
		if (
			map[parseInt(this.y / oneBlockSize)][
				parseInt(this.x / oneBlockSize)
			] == 1 ||
			map[parseInt(this.y / oneBlockSize + 0.9999)][
				parseInt(this.x / oneBlockSize)
			] == 1 ||
			map[parseInt(this.y / oneBlockSize)][
				parseInt(this.x / oneBlockSize + 0.9999)
			] == 1 ||
			map[parseInt(this.y / oneBlockSize + 0.9999)][
				parseInt(this.x / oneBlockSize + 0.9999)
			] == 1
		) {
			isCollided = true;
		}
		return isCollided;
	}

	changeDirectionIfPossible() {
		// 가능한 경우 방향을 변경하는 메서드
		let tempDirection = this.direction;
		// 새로운 방향 계산
		this.direction = this.calculateNewDirection(
			map,
			parseInt(this.target.x / oneBlockSize),
			parseInt(this.target.y / oneBlockSize)
		);
		if (typeof this.direction == "undefined") {
			// 새로운 방향이 정의되지 않은 경우
			this.direction = tempDirection; // 이전 방향으로 설정
			return;
		}
		// 벽에 붙어서 이동할 수 없는 경우 방향을 변경
		if (
			this.getMapY() != this.getMapYRightSide() &&
			(this.direction == DIRECTION_LEFT ||
				this.direction == DIRECTION_RIGHT)
		) {
			this.direction = DIRECTION_UP;
		}
		if (
			this.getMapX() != this.getMapXRightSide() &&
			this.direction == DIRECTION_UP
		) {
			this.direction = DIRECTION_LEFT;
		}
		this.moveForwards(); // 이동
		if (this.checkCollisions()) {
			// 충돌 확인
			this.moveBackwards(); // 충돌이 발생하면 뒤로 이동
			this.direction = tempDirection; // 이전 방향으로 설정
		} else {
			this.moveBackwards();
		}
		console.log(this.direction);
	}

	calculateNewDirection(map, destX, destY) {
		// 새로운 방향을 계산하는 메서드
		let mp = [];
		for (let i = 0; i < map.length; i++) {
			mp[i] = map[i].slice();
		}
		let queue = [
			{
				x: this.getMapX(),
				y: this.getMapY(),
				rightX: this.getMapXRightSide(),
				rightY: this.getMapYRightSide(),
				moves: [],
			},
		];
		while (queue.length > 0) {
			let poped = queue.shift();
			if (poped.x == destX && poped.y == destY) {
				return poped.moves[0];
			} else {
				mp[poped.y][poped.x] = 1;
				let neighborList = this.addNeighbors(poped, mp);
				for (let i = 0; i < neighborList.length; i++) {
					queue.push(neighborList[i]);
				}
			}
		}
		return 1; // 기본 방향
	}

	addNeighbors(poped, mp) {
		// 이웃한 셀을 추가하는 메서드
		let queue = [];
		let numOfRows = mp.length;
		let numOfColumns = mp[0].length;

		if (
			poped.x - 1 >= 0 &&
			poped.x - 1 < numOfRows &&
			mp[poped.y][poped.x - 1] != 1
		) {
			let tempMoves = poped.moves.slice();
			tempMoves.push(DIRECTION_LEFT);
			queue.push({
				x: poped.x - 1,
				y: poped.y,
				moves: tempMoves,
			});
		}
		// 오른쪽 셀 추가
		if (
			poped.x + 1 >= 0 &&
			poped.x + 1 < numOfRows &&
			mp[poped.y][poped.x + 1] != 1
		) {
			let tempMoves = poped.moves.slice();
			tempMoves.push(DIRECTION_RIGHT);
			queue.push({
				x: poped.x + 1,
				y: poped.y,
				moves: tempMoves,
			});
		}
		// 위쪽 셀 추가
		if (
			poped.y - 1 >= 0 &&
			poped.y - 1 < numOfColumns &&
			mp[poped.y - 1][poped.x] != 1
		) {
			let tempMoves = poped.moves.slice();
			tempMoves.push(DIRECTION_UP);
			queue.push({
				x: poped.x,
				y: poped.y - 1,
				moves: tempMoves,
			});
		}
		// 아래쪽 셀 추가
		if (
			poped.y + 1 >= 0 &&
			poped.y + 1 < numOfColumns &&
			mp[poped.y + 1][poped.x] != 1
		) {
			let tempMoves = poped.moves.slice();
			tempMoves.push(DIRECTION_BOTTOM);
			queue.push({
				x: poped.x,
				y: poped.y + 1,
				moves: tempMoves,
			});
		}
		return queue;
	}

	getMapX() {
		let mapX = parseInt(this.x / oneBlockSize);
		return mapX;
	}

	getMapY() {
		let mapY = parseInt(this.y / oneBlockSize);
		return mapY;
	}

	getMapXRightSide() {
		let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
		return mapX;
	}

	getMapYRightSide() {
		let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
		return mapY;
	}

	changeAnimation() {
		this.currentFrame =
			this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
	}

	draw() {
		ctx.save();
		ctx.drawImage(
			ghostFrames,
			this.imageX,
			this.imageY,
			this.imageWidth,
			this.imageHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
		ctx.restore();
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.arc(
			this.x + oneBlockSize / 2,
			this.y + oneBlockSize / 2,
			this.range * oneBlockSize,
			0,
			2 * Math.PI
		);
		ctx.stroke();
	}
}

let updateGhosts = () => {
	for (let i = 0; i < ghosts.length; i++) {
		ghosts[i].moveProcess();
	}
};

let drawGhosts = () => {
	for (let i = 0; i < ghosts.length; i++) {
		ghosts[i].draw();
	}
};
