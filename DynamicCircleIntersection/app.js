class App {
	constructor() {
		this.circleSpeed = 0.4;
		this.circleStrokeColor = "white";
		this.intersectionFillColor = "#666677";
		this.intersectionStrokeColor = "white";
	}
	init() {
		this.createCanvas();
		this.resize();
		this.createCircles();
		this.updateAnimation();

		window.addEventListener("resize", () => {
			this.resize();
			this.createCircles();
		});
	}

	createCanvas() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
		this.canvas.style.background = this.getRandomColor();
	}

	getRandomColor(alpha = 1) {
		return `hsla(${Math.random() * 360}, 70%, 50%, ${alpha})`;
	}

	resize() {
		this.stageWidth = this.canvas.width = innerWidth;
		this.stageHeight = this.canvas.height = innerHeight;
		// this.stageWidth = document.body.clientWidth;
		// this.stageHeight = document.body.clientHeight;

		// this.canvas.width = this.stageWidth * 2;
		// this.canvas.height = this.stageHeight * 2;
		// this.ctx.scale(2, 2);
	}

	createCircles() {
		let biggerSide = Math.max(this.stageWidth, this.stageHeight);
		let smallerSide = Math.min(this.stageWidth, this.stageHeight);
		let maxRadius = smallerSide / 3;
		let minRadius = maxRadius / 2;
		let circlesNum = 3 * (2 - smallerSide / biggerSide);
		this.intersectionDotRadius = minRadius / 10;

		this.circles = [];
		for (let i = 0; i < circlesNum; ++i) {
			let randomAngle = Math.random() * (Math.PI * 2);
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
			this.circles.push(newCircle);
		}
	}

	getRandomFromRange(min, max) {
		return Math.random() * (max - min) + min;
	}
	updateCircles() {
		this.ctx.globalCompositeOperation = "lighter";

		this.circles.forEach((circle) => {
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

		this.ctx.globalCompositeOperation = "normal";
	}
	drawCircle(x, y, radius, fillColor, strokeColor) {
		this.ctx.fillStyle = fillColor;
		this.ctx.strokeStyle = strokeColor;
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.stroke();
	}
	getIntersection() {
		for (let i = 0; i < this.circles.length; ++i) {
			let circleA = this.circles[i];
			for (let j = i + 1; j < this.circles.length; ++j) {
				let circleB = this.circles[j];

				let dx = circleB.xPos - circleA.xPos;
				let dy = circleB.yPos - circleA.yPos;
				let distance = Math.hypot(dx, dy);

				if (distance <= circleA.radius + circleB.radius) {
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
		let aSquare = Math.pow(sideA, 2);
		let bSquare = Math.pow(sideB, 2);
		let cSquare = Math.pow(sideC, 2);

		let cosA = (aSquare - bSquare + cSquare) / (sideA * sideC * 2);
		let angleOfRotation = Math.acos(cosA);
		let angleCorrection = Math.atan2(dy, dx);

		let pointOneX =
			circle.xPos + Math.cos(angleCorrection - angleOfRotation) * sideA;
		let pointOneY =
			circle.yPos + Math.sin(angleCorrection - angleOfRotation) * sideA;
		let pointTwoX =
			circle.xPos + Math.cos(angleCorrection + angleOfRotation) * sideA;
		let pointTwoY =
			circle.yPos + Math.sin(angleCorrection + angleOfRotation) * sideA;

		this.drawCircle(
			pointOneX,
			pointOneY,
			this.intersectionDotRadius,
			this.intersectionFillColor,
			this.intersectionStrokeColor
		);
		this.drawCircle(
			pointTwoX,
			pointTwoY,
			this.intersectionDotRadius,
			this.intersectionFillColor,
			this.intersectionStrokeColor
		);
	}
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
	}

	updateAnimation() {
		this.clearCanvas();
		this.updateCircles();
		this.getIntersection();

		window.requestAnimationFrame(() => this.updateAnimation());
	}
}

window.onload = () => {
	new App().init();
	new App().init();
	new App().init();
};
