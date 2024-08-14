import { Branch } from "./branch.js";

const COLOR_ARR = [
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
];

export class Tree {
	constructor(ctx, posX, posY, isDay) {
		this.ctx = ctx; // 2D drawing context // 2D 그리기 컨텍스트
		this.posX = posX; // X coordinate for the base of the tree // 나무의 시작 X 좌표
		this.posY = posY; // Y coordinate for the base of the tree // 나무의 시작 Y 좌표
		this.isDay = isDay; // Boolean indicating if it's day or night // 낮/밤 모드를 나타내는 불리언 값

		this.depth = 11; // Maximum depth of branches // 가지의 최대 분기
		this.color = this.isDay ? "#000000" : this.getRandomColor(); // Branch color based on day/night mode // 낮/밤 모드에 따라 가지 색상 결정
		this.branches = Array.from({ length: this.depth }, () => []); // Initialize an array of branches for each depth level // 각 depth 레벨에 대한 가지 배열을 초기화

		this.currentDepth = 0; // Current depth of drawing // 현재 그려지고 있는 가지의 depth
		this.animationFrame = null; // Store animation frame ID // 애니메이션 프레임 ID를 저장

		this.init(); // Initialize tree drawing // 나무 그리기 초기화
	}

	init() {
		// Start growing branches from the base position // 나무의 시작 위치에서 가지 그리기 시작
		this.growBranch(this.posX, this.posY, -90, 0); // Start with -90 degrees (upwards) // -90도(위쪽)에서 가지 성장 시작 (아래에서 위로 자라도록 시작 depth = - 로 줌)
		this.animate();
	}

	getRandomColor() {
		// Get a random color from COLOR_ARR // COLOR_ARR에서 랜덤 색상 선택
		return COLOR_ARR[Math.floor(Math.random() * COLOR_ARR.length)];
	}

	growBranch(startX, startY, angle, depth) {
		// Recursively grow branches from a start position // 시작 위치에서 가지를 재귀적으로 성장시킵니다.
		if (depth === this.depth) return; // Stop if maximum depth is reached // 최대 깊이에 도달하면 종료

		const length = depth === 0 ? this.random(10, 13) : this.random(0, 11);
		// Determine branch length // 가지 길이 결정
		// random 함수를 만들어 가지들의 길이를 랜덤으로 주고
		// depth가 0 즉, 나무 기둥을 그릴땐 최소, 최대 길이를 달리함
		// 첫 밑둥을 만들 때는 어느정도 고정길이를 주고, 그 이후에 뻗어나오는 가지는 랜덤하게
		const endX =
			startX +
			Math.cos(this.degToRad(angle)) * length * (this.depth - depth); // Calculate end X position // 끝 X 위치 계산
		const endY =
			startY +
			Math.sin(this.degToRad(angle)) * length * (this.depth - depth); // Calculate end Y position // 끝 Y 위치 계산
		// 현재 depth의 역을 곱해주어 depth가 점점 늘어날 수록 길이가 가늘게 함
		// 첫 밑둥을 최대 길이로 하고 가지가 늘어날수록 길이를 작아지게 하기위해 len뒤에 식을 넣어줌

		// Create a new branch and add it to the branches array // 새로운 가지를 생성하고 가지 배열에 추가
		this.branches[depth].push(
			new Branch(
				startX,
				startY,
				endX,
				endY,
				this.depth - depth,
				this.color
			)
		);

		// Recursively grow branches at new angles // 새로운 각도에서 가지를 재귀적으로 성장
		const angleVariance = this.random(15, 23); // Random variance for branching angles // 가지 각도의 랜덤 변동
		this.growBranch(endX, endY, angle - angleVariance, depth + 1); // Grow left branch // 왼쪽 가지 성장
		this.growBranch(endX, endY, angle + angleVariance, depth + 1); // Grow right branch // 오른쪽 가지 성장
		// branches에 가지가 push되면 생성된 가지의 끝부분을 시작으로 각도를 랜덤하게.
		// 좌우 각도를 주어 가지 2개를 또 생성
		// 마지막 depth까지 재귀호출되면 return
	}

	animate() {
		// Animate the drawing of branches // 가지 그리기의 애니메이션 처리
		if (this.currentDepth === this.depth) {
			cancelAnimationFrame(this.animationFrame); // Stop animation when complete // 애니메이션 완료 시 정지
			return;
		}

		let allBranchesDrawn = true; // Flag to check if all branches are drawn // 모든 가지가 그려졌는지 확인하는 플래그

		// Draw branches for the current depth level // 현재 깊이 레벨의 가지를 그리기
		for (let i = this.currentDepth; i < this.branches.length; i++) {
			for (const branch of this.branches[i]) {
				const isComplete = branch.draw(this.ctx); // Draw the branch and check if complete // 가지를 그리고 완료 여부 확인
				if (!isComplete) {
					allBranchesDrawn = false; // If any branch is not complete, continue animation // 가지가 완료되지 않으면 애니메이션 계속
				}
			}

			if (allBranchesDrawn) {
				this.currentDepth++; // Move to the next depth level if all branches are drawn // 모든 가지가 그려졌다면 다음 depth로 이동
			} else {
				break; // Exit loop if not all branches are drawn // 모든 가지가 그려지지 않았으면 루프 종료
			}
		}

		this.animationFrame = requestAnimationFrame(this.animate.bind(this));
	}

	degToRad(angle) {
		// Convert degrees to radians // 각도를 라디안으로 변환
		return (angle / 180) * Math.PI;
	}

	random(min, max) {
		// Get a random integer between min and max (inclusive) // 최소값과 최대값 사이의 랜덤 정수 반환
		return Math.floor(Math.random() * (max - min + 1)) + min; // Random number between min and max // 최소값과 최대값 사이의 랜덤 숫자
	}
}

/*
  - Tree 클래스는 주어진 좌표에서 가지를 그리는 나무를 생성
  - growBranch() 메서드는 재귀적으로 가지를 생성하며,
    animate() 메서드는 가지의 애니메이션을 처리
  - getRandomColor()는 가지 색상을 랜덤으로 선택
  - degToRad()는 각도를 라디안으로 변환하며,
    random() 메서드는 주어진 범위 내에서 랜덤한 정수를 생성
  - 애니메이션은 재귀적으로 호출되어 가지의 애니메이션을 매 프레임마다 업데이트
*/

/*
  관련 MDN 문서:
  - [Math.cos()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/cos) // 코사인 함수
  - [Math.sin()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin) // 사인 함수
  - [Math.random()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random) // 랜덤 숫자 생성
  - [Math.floor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor) // 소수점을 내림하여 정수로 변환
  - [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) // 애니메이션 프레임 요청
  - [cancelAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/cancelAnimationFrame) // 애니메이션 프레임 취소
*/

/*
const COLOR_ARR = [
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
];

export class Tree {
	constructor(ctx, posX, posY, day) {
		this.ctx = ctx;
		this.posX = posX;
		this.posY = posY;
		this.branches = [];
		this.depth = 11;
		this.day = day;

		if (this.day) {
			this.color = "#000000";
		} else {
			this.color =
				COLOR_ARR[Math.floor(Math.random() * COLOR_ARR.length)];
		}

		this.cntDepth = 0;
		this.animation = null;

		this.init();
	}

	init() {
		for (let i = 0; i < this.depth; i++) {
			this.branches.push([]);
		}
		this.growBranch(this.posX, this.posY, -90, 0);
		this.draw();
	}

	growBranch(startX, startY, angle, depth) {
		if (depth === this.depth) return;

		const len = depth === 0 ? this.random(10, 13) : this.random(0, 11);

		const endX = startX + this.cos(angle) * len * (this.depth - depth);

		const endY = startY + this.sin(angle) * len * (this.depth - depth);

		this.branches[depth].push(
			new Branch(
				startX,
				startY,
				endX,
				endY,
				this.depth - depth,
				this.color
			)
		);

		this.growBranch(endX, endY, angle - this.random(15, 23), depth + 1);
		this.growBranch(endX, endY, angle + this.random(15, 23), depth + 1);
	}

	draw() {
		if (this.cntDepth === this.depth) {
			cancelAnimationFrame(this.animation);
		}

		for (let i = this.cntDepth; i < this.branches.length; i++) {
			let pass = true;

			for (let j = 0; j < this.branches[i].length; j++) {
				pass = this.branches[i][j].draw(this.ctx);
			}

			if (!pass) break;
			this.cntDepth++;
		}
		this.animation = requestAnimationFrame(this.draw.bind(this));
	}

	cos(angle) {
		return Math.cos(this.degToRad(angle));
	}
	sin(angle) {
		return Math.sin(this.degToRad(angle));
	}
	degToRad(angle) {
		return (angle / 180.0) * Math.PI;
	}

	random(min, max) {
		return min + Math.floor(Math.random() * (max - min + 1));
	}
}
*/
