import { Point } from "./point.js";

const FOLLOW_SPEED = 0.08; // The speed at which the dialog follows its target position
// dialog가 목표 위치를 따르는 속도

const ROTATE_SPEED = 0.12; // The speed at which the dialog rotates
// dialog가 회전하는 속도

const MAX_ANGLE = 30; // The maximum angle for swinging effect
// 흔들림 효과를 위한 최대 각도

const FPS = 1000 / 60; // Frame per second (60 FPS)
// 초당 프레임 수 (60 FPS)

const WIDTH = 160; // Width of the dialog box
// dialog의 너비

const HEIGHT = 260; // Height of the dialog box
// dialog의 높이

export class Dialog {
	constructor() {
		// Initialize various properties related to position, rotation, and state
		// 위치, 회전 및 상태와 관련된 다양한 속성을 초기화
		this.pos = new Point(); // Current position of the dialog
		// dialog의 현재 위치
		this.target = new Point(); // Target position for smooth movement
		// 부드러운 움직임을 위한 목표 위치
		this.prevPos = new Point(); // Previous position to calculate movement
		// 이동을 계산하기 위한 이전 위치
		this.downPos = new Point(); // Position where the mouse was pressed
		// 마우스가 클릭된 위치
		this.startPos = new Point(); // Initial position when dragging started
		// 드래그가 시작될 때의 초기 위치
		this.mousePos = new Point(); // Position of the mouse
		// 마우스의 위치
		this.centerPos = new Point(); // Center position of the dialog
		// dialog의 중심 위치
		this.origin = new Point(); // Origin point for rotation
		// 회전을 위한 원점
		this.rotation = 0; // Current rotation angle
		// 현재 회전 각도
		this.sideValue = 0; // Value to determine the side of the drag
		// 드래그의 방향을 결정하기 위한 값
		this.isDown = false; // Flag to check if the dialog is being dragged
		// dialog가 드래그 중인지 확인하는 플래그
	}

	resize(stageWidth, stageHeight) {
		// Set the initial position of the dialog box within the stage boundaries
		// 스테이지 경계 내에서 dialog의 초기 위치를 설정
		this.pos.x = Math.random() * (stageWidth - WIDTH);
		// dialog의 x 위치를 랜덤하게 설정
		this.pos.y = Math.random() * (stageHeight - HEIGHT);
		// dialog의 y 위치를 랜덤하게 설정
		this.target = this.pos.clone(); // Set the target to the initial position
		// 목표 위치를 초기 위치로 설정
		this.prevPos = this.pos.clone(); // Set the previous position to the initial position
		// 이전 위치를 초기 위치로 설정
	}

	animate(ctx) {
		// Update the position of the dialog to follow the target position
		// dialog의 위치를 목표 위치를 따라 업데이트
		const move = this.target
			.clone()
			.subtract(this.pos)
			.reduce(FOLLOW_SPEED); // Move towards the target position
		// 목표 위치를 향해 이동
		this.pos.add(move); // Update the current position
		// 현재 위치를 업데이트

		// Calculate the center position of the dialog
		// dialog의 중심 위치를 계산
		this.centerPos = this.pos.clone().add(this.mousePos);

		this.swingDrag(ctx); // Apply the swinging effect
		// 흔들림 효과를 적용

		this.prevPos = this.pos.clone(); // Update the previous position
		// 이전 위치를 업데이트
	}

	swingDrag(ctx) {
		// Calculate the speed of horizontal movement
		// 수평 이동 속도를 계산
		const dx = this.pos.x - this.prevPos.x;
		const speedX = Math.abs(dx) / FPS;
		const speed = Math.min(Math.max(speedX, 0), 1);

		// Calculate the rotation angle based on the speed
		// 속도에 따라 회전 각도를 계산
		let rotation = (MAX_ANGLE / 1) * speed;
		rotation = rotation * (dx > 0 ? 1 : -1) - this.sideValue;

		this.rotation += (rotation - this.rotation) * ROTATE_SPEED; // Smoothly rotate the dialog
		// dialog를 부드럽게 회전

		// Draw the dialog box with swinging effect
		// 흔들림 효과를 적용하여 dialog를 그림
		const tmpPos = this.pos.clone().add(this.origin);
		ctx.save();
		ctx.translate(tmpPos.x, tmpPos.y); // Move to the dialog's position
		// dialog의 위치로 이동
		ctx.rotate((this.rotation * Math.PI) / 180); // Rotate the canvas
		// 캔버스를 회전
		ctx.beginPath();
		ctx.fillStyle = `#f4e55a`; // Set the fill color for the dialog box
		// dialog의 채우기 색상을 설정
		ctx.fillRect(-this.origin.x, -this.origin.y, WIDTH, HEIGHT); // Draw the dialog box
		// dialog를 그림
		ctx.restore(); // Restore the canvas state
		// 캔버스 상태를 복원
	}

	down(point) {
		// Check if the mouse click is inside the dialog box
		// 마우스 클릭이 dialog 내부인지 확인
		if (point.collide(this.pos, WIDTH, HEIGHT)) {
			this.isDown = true; // Set the dragging flag
			// 드래그 플래그를 설정
			this.startPos = this.pos.clone(); // Record the starting position
			// 시작 위치를 기록
			this.downPos = point.clone(); // Record the mouse position
			// 마우스 위치를 기록
			this.mousePos = point.clone().subtract(this.pos); // Calculate the relative mouse position
			// 상대적인 마우스 위치를 계산

			const xRatioValue = this.mousePos.x / WIDTH;
			this.origin.x = WIDTH * xRatioValue; // Calculate the origin for rotation
			// 회전을 위한 원점 계산
			this.origin.y = (HEIGHT * this.mousePos.y) / HEIGHT;

			this.sideValue = xRatioValue - 0.5; // Determine the side of the drag
			// 드래그의 방향 결정

			return this;
		} else {
			return null; // Return null if not inside the dialog box
			// dialog 내부가 아니면 null 반환
		}
	}

	move(point) {
		// Update the target position while dragging
		// 드래그 중에 목표 위치를 업데이트
		if (this.isDown) {
			this.target = this.startPos
				.clone()
				.add(point)
				.subtract(this.downPos);
		}
	}

	up() {
		// Reset the dragging flag when the mouse is released
		// 마우스가 떼어질 때 드래그 플래그를 리셋
		this.isDown = false;
	}
}
