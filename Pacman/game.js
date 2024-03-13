const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;

let lives = 3;
let ghostCount = 4;
let ghostImageLocations = [
	{ x: 0, y: 0 },
	{ x: 176, y: 0 },
	{ x: 0, y: 121 },
	{ x: 176, y: 121 },
];

// Game variables
let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";

// 2 = Food, 1 = wall, 0 = not wall
// 21 columns, 23 rows
let map = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
	[1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
	[1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
	[2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
	[1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
	[1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
	[1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
	[1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
	[1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
	[1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//  유령 초기 위치
let randomTargetsForGhosts = [
	{ x: 1 * oneBlockSize, y: 1 * oneBlockSize },
	{ x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
	{ x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
	{
		x: (map[0].length - 2) * oneBlockSize,
		y: (map.length - 2) * oneBlockSize,
	},
];

// for (let i = 0; i < map.length; i++) {
//     for (let j = 0; j < map[0].length; j++) {
//         map[i][j] = 2;
//     }
// }

let createNewPacman = () => {
	// 새로운 팩맨 인스턴스 생성
	pacman = new Pacman(
		oneBlockSize,
		oneBlockSize,
		oneBlockSize,
		oneBlockSize,
		oneBlockSize / 5
	);
};

let gameLoop = () => {
	// Loop에서 게임 상태를 update, draw
	update();
	draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
	// 팩맨과 유령 초기화 / 재시작
	createNewPacman();
	createGhosts();
};

let onGhostCollision = () => {
	// 유령과 충돌했을 때 event, Lift 감소 + 재시작
	lives--;
	restartPacmanAndGhosts();
	if (lives == 0) {
	}
};

let update = () => {
	// 게임 상태 update (이동, 음식 먹기, 충돌 감지 등)
	pacman.moveProcess();
	pacman.eat();
	updateGhosts();
	if (pacman.checkGhostCollision(ghosts)) {
		onGhostCollision();
	}
};

let drawFoods = () => {
	// 맵 배열을 순회하여 음식을 그리는 함수
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			// 현재 위치에 음식이 있는지 확인
			if (map[i][j] == 2) {
				// 음식이 있다면, 해당 위치에 작은 원형으로 음식을 그림, map[i][j]가 2일 때만 음식을 그림 (map=[] 상의 2)
				createRect(
					j * oneBlockSize + oneBlockSize / 3, // 음식을 그릴 x 좌표
					i * oneBlockSize + oneBlockSize / 3, // 음식을 그릴 y 좌표
					oneBlockSize / 3, // 음식의 반지름 (크기)
					oneBlockSize / 3, // 음식의 반지름 (크기)
					"#FEB897" // 음식의 색상
				);
			}
		}
	}
};

let drawRemainingLives = () => {
	// 남은 목숨을 그리는 함수
	ctx.font = "20px Emulogic";
	ctx.fillStyle = "white";
	ctx.fillText("Lives: ", 220, oneBlockSize * (map.length + 1)); // "Lives: " 텍스트를 그릴 위치 설정

	// 남은 목숨 수만큼 팩맨 이미지를 그림
	for (let i = 0; i < lives; i++) {
		// ctx.drawImage를 사용하여 팩맨 이미지를 그림
		ctx.drawImage(
			pacmanFrames, // 팩맨 이미지를 지정
			2 * oneBlockSize, // 팩맨 이미지의 x 좌표 (sprite sheet에서의 위치)
			0, // 팩맨 이미지의 y 좌표 (sprite sheet에서의 위치)
			oneBlockSize, // 팩맨 이미지의 너비
			oneBlockSize, // 팩맨 이미지의 높이
			350 + i * oneBlockSize, // 캔버스 상에서 팩맨을 그릴 x 좌표
			oneBlockSize * map.length + 2, // 캔버스 상에서 팩맨을 그릴 y 좌표
			oneBlockSize, // 팩맨 이미지의 너비
			oneBlockSize // 팩맨 이미지의 높이
		);
	}
};

let drawScore = () => {
	ctx.font = "20px Emulogic";
	ctx.fillStyle = "white";
	ctx.fillText("Score: " + score, 0, oneBlockSize * (map.length + 1));
};

let draw = () => {
	// 게임 렌더링, canvas 를 지우고 벽, 음식, 유령, 팩맨 등을 그림
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	createRect(0, 0, canvas.width, canvas.height, "black");
	drawWalls();
	drawFoods();
	drawGhosts();
	pacman.draw();
	drawScore();
	drawRemainingLives();
};

let drawWalls = () => {
	// 벽 그리기
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (map[i][j] == 1) {
				createRect(
					j * oneBlockSize,
					i * oneBlockSize,
					oneBlockSize,
					oneBlockSize,
					"#342DCA"
				);
				if (j > 0 && map[i][j - 1] == 1) {
					createRect(
						j * oneBlockSize,
						i * oneBlockSize + wallOffset,
						wallSpaceWidth + wallOffset,
						wallSpaceWidth,
						wallInnerColor
					);
				}

				if (j < map[0].length - 1 && map[i][j + 1] == 1) {
					createRect(
						j * oneBlockSize + wallOffset,
						i * oneBlockSize + wallOffset,
						wallSpaceWidth + wallOffset,
						wallSpaceWidth,
						wallInnerColor
					);
				}

				if (i < map.length - 1 && map[i + 1][j] == 1) {
					createRect(
						j * oneBlockSize + wallOffset,
						i * oneBlockSize + wallOffset,
						wallSpaceWidth,
						wallSpaceWidth + wallOffset,
						wallInnerColor
					);
				}

				if (i > 0 && map[i - 1][j] == 1) {
					createRect(
						j * oneBlockSize + wallOffset,
						i * oneBlockSize,
						wallSpaceWidth,
						wallSpaceWidth + wallOffset,
						wallInnerColor
					);
				}
			}
		}
	}
};

let createGhosts = () => {
	// 유령들을 생성하는 함수
	ghosts = []; // 유령 배열 초기화
	for (let i = 0; i < ghostCount * 2; i++) {
		// 유령 개수의 두 배만큼 반복
		let newGhost = new Ghost( // 새로운 유령 객체 생성
			9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize, // x 좌표 계산
			10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize, // y 좌표 계산
			oneBlockSize, // 유령의 너비
			oneBlockSize, // 유령의 높이
			pacman.speed / 2, // 유령의 속도 설정
			ghostImageLocations[i % 4].x, // 유령 이미지의 x 좌표 (sprite sheet에서의 위치)
			ghostImageLocations[i % 4].y, // 유령 이미지의 y 좌표 (sprite sheet에서의 위치)
			124, // 유령 이미지의 너비
			116, // 유령 이미지의 높이
			6 + i // 유령의 고유한 식별자
		);
		ghosts.push(newGhost); // 새로운 유령 객체를 유령 배열에 추가
	}
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
	// 키보드 event
	let k = event.keyCode;
	setTimeout(() => {
		if (k == 37 || k == 65) {
			// left arrow or a
			pacman.nextDirection = DIRECTION_LEFT;
		} else if (k == 38 || k == 87) {
			// up arrow or w
			pacman.nextDirection = DIRECTION_UP;
		} else if (k == 39 || k == 68) {
			// right arrow or d
			pacman.nextDirection = DIRECTION_RIGHT;
		} else if (k == 40 || k == 83) {
			// bottom arrow or s
			pacman.nextDirection = DIRECTION_BOTTOM;
		}
	}, 1);
});
