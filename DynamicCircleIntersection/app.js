class App {
	constructor() {
		// 원의 이동 속도
		this.circleSpeed = 0.4;
		// 원의 테두리 색상
		this.circleStrokeColor = "white";
		// 교차점 채우기 색상
		this.intersectionFillColor = "#666677";
		// 교차점 테두리 색상
		this.intersectionStrokeColor = "white";
	}

	init() {
		// 캔버스 생성 및 초기화
		this.createCanvas();
		// 캔버스 크기 조절
		this.resize();
		// 원 생성
		this.createCircles();
		// 애니메이션 업데이트
		this.updateAnimation();

		// 창 크기가 변경될 때마다 실행
		window.addEventListener("resize", () => {
			// 캔버스 크기 조절
			this.resize();
			// 원 재생성
			this.createCircles();
		});
	}

	createCanvas() {
		// 캔버스 요소 생성
		this.canvas = document.createElement("canvas");
		// 2D 컨텍스트 생성
		this.ctx = this.canvas.getContext("2d");
		// 캔버스를 문서에 추가
		document.body.appendChild(this.canvas);
		// 캔버스 배경색 랜덤 지정
		this.canvas.style.background = this.getRandomColor();
	}

	getRandomColor(alpha = 1) {
		// 랜덤한 색상 생성
		return `hsla(${Math.random() * 360}, 70%, 50%, ${alpha})`;
	}

	resize() {
		// 캔버스 크기 조절
		this.stageWidth = this.canvas.width = innerWidth;
		this.stageHeight = this.canvas.height = innerHeight;
	}

	createCircles() {
		// 원 생성에 필요한 변수 설정
		let biggerSide = Math.max(this.stageWidth, this.stageHeight);
		let smallerSide = Math.min(this.stageWidth, this.stageHeight);
		let maxRadius = smallerSide / 3;
		let minRadius = maxRadius / 2;
		let circlesNum = 3 * (2 - smallerSide / biggerSide);
		this.intersectionDotRadius = minRadius / 10;

		// 원 배열 초기화
		this.circles = [];
		for (let i = 0; i < circlesNum; ++i) {
			// 랜덤한 각도 설정
			let randomAngle = Math.random() * (Math.PI * 2);
			// 새로운 원 객체 생성
			let newCircle = {
				color: this.getRandomColor(0.5),
				radius: this.getRandomFromRange(minRadius, maxRadius),
				xPos: this.getRandomFromRange(
					maxRadius,
					this.stageWidth - maxRadius
				),
				yPos: this.getRandomFromRange(
					maxRadius,
					this.stageHeight - maxRadius
				),
				velocityX: Math.cos(randomAngle) * this.circleSpeed,
				velocityY: Math.sin(randomAngle) * this.circleSpeed,
			};
			// 원 배열에 추가
			this.circles.push(newCircle);
		}
	}

	getRandomFromRange(min, max) {
		// 주어진 범위 내에서 랜덤한 값 반환
		return Math.random() * (max - min) + min;
	}

	updateCircles() {
		// 캔버스에 그려진 모든 요소를 더 밝게 표시
		this.ctx.globalCompositeOperation = "lighter";

		this.circles.forEach((circle) => {
			// 원이 캔버스 경계에 도달하면 방향을 반전시킴
			if (
				(circle.xPos + circle.radius > this.stageWidth &&
					circle.velocityX > 0) ||
				(circle.xPos < circle.radius && circle.velocityX < 0)
			) {
				circle.velocityX = -circle.velocityX;
			}
			if (
				(circle.yPos + circle.radius > this.stageHeight &&
					circle.velocityY > 0) ||
				(circle.yPos < circle.radius && circle.velocityY < 0)
			) {
				circle.velocityY = -circle.velocityY;
			}

			// 원을 이동하고 그림
			circle.xPos += circle.velocityX;
			circle.yPos += circle.velocityY;
			this.drawCircle(
				circle.xPos,
				circle.yPos,
				circle.radius,
				circle.color,
				this.circleStrokeColor
			);
		});

		// 캔버스에 그려진 모든 요소의 표시 설정을 원래대로 복원
		this.ctx.globalCompositeOperation = "normal";
	}

	drawCircle(x, y, radius, fillColor, strokeColor) {
		// 원 그리기
		this.ctx.fillStyle = fillColor;
		this.ctx.strokeStyle = strokeColor;
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}

	getIntersection() {
		// 원들 간의 교차점을 계산
		for (let i = 0; i < this.circles.length; ++i) {
			// 현재 원 (circleA)을 선택
			let circleA = this.circles[i];
			for (let j = i + 1; j < this.circles.length; ++j) {
				// 나머지 원 (circleB)과의 교차점을 검사
				let circleB = this.circles[j];

				// 두 원 중심 사이의 거리를 계산
				let dx = circleB.xPos - circleA.xPos;
				let dy = circleB.yPos - circleA.yPos;
				let distance = Math.hypot(dx, dy);

				// 두 원의 반지름의 합보다 거리가 작거나 같으면 교차점이 있음
				if (distance <= circleA.radius + circleB.radius) {
					// 교차점을 그리는 메서드를 호출
					this.drawIntersection(
						circleA.radius,
						circleB.radius,
						distance,
						dx,
						dy,
						circleA
					);
				}
			}
		}
	}

	drawIntersection(sideA, sideB, sideC, dx, dy, circle) {
		// 교차점 그리기

		// 각 변의 길이의 제곱 계산
		let aSquare = Math.pow(sideA, 2);
		let bSquare = Math.pow(sideB, 2);
		let cSquare = Math.pow(sideC, 2);

		// 코사인 사용하여 각도 계산
		let cosA = (aSquare - bSquare + cSquare) / (sideA * sideC * 2); // 코사인 법칙을 사용하여 한 꼭짓점에서의 각도를 계산
		let angleOfRotation = Math.acos(cosA); // 코사인 값으로부터 각도를 계산하여 angleOfRotation 변수에 저장합
		let angleCorrection = Math.atan2(dy, dx); // 원점과의 각도 보정을 수행

		// 교차점 위치 계산
		let pointOneX =
			circle.xPos + Math.cos(angleCorrection - angleOfRotation) * sideA; // 첫 번째 교차점의 x 좌표를 계산
		let pointOneY =
			circle.yPos + Math.sin(angleCorrection - angleOfRotation) * sideA; // 첫 번째 교차점의 y 좌표를 계산
		let pointTwoX =
			circle.xPos + Math.cos(angleCorrection + angleOfRotation) * sideA; // 두 번째 교차점의 x 좌표를 계산
		let pointTwoY =
			circle.yPos + Math.sin(angleCorrection + angleOfRotation) * sideA; // 두 번째 교차점의 y 좌표를 계산

		// 교차점을 원으로 그리기
		this.drawCircle(
			pointOneX,
			pointOneY,
			this.intersectionDotRadius,
			this.intersectionFillColor,
			this.intersectionStrokeColor
		); // 첫 번째 교차점을 원으로 그립니다.
		this.drawCircle(
			pointTwoX,
			pointTwoY,
			this.intersectionDotRadius,
			this.intersectionFillColor,
			this.intersectionStrokeColor
		); // 두 번째 교차점을 원으로 그립니다.
	}

	clearCanvas() {
		// 캔버스 지우기
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
	}

	updateAnimation() {
		// 캔버스 애니메이션 업데이트
		this.clearCanvas();
		this.updateCircles();
		this.getIntersection();

		// 다음 애니메이션 프레임 요청
		window.requestAnimationFrame(() => this.updateAnimation());
	}
}

window.onload = () => {
	// 앱 초기화
	new App().init();
	// 앱 초기화
	new App().init();
	// 앱 초기화
	new App().init();
};
