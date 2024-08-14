export class Branch {
	constructor(startX, startY, endX, endY, lineWidth, color) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
		this.lineWidth = lineWidth;
		this.color = this.adjustColorForLineWidth(color, lineWidth); // Adjust the color based on line width // 선 두께에 따라 색상 조정

		this.frames = 10;
		this.currentFrame = 0;

		this.gapX = (endX - startX) / this.frames; // X direction gap per frame // 프레임당 X 방향 간격
		this.gapY = (endY - startY) / this.frames; // Y direction gap per frame // 프레임당 Y 방향 간격

		this.currentX = startX; // Current X coordinate // 현재 X 좌표
		this.currentY = startY; // Current Y coordinate // 현재 Y 좌표
	}

	adjustColorForLineWidth(color, lineWidth) {
		// Adjust color based on line width // 선 두께에 따라 색상 조정
		if (color === "#000000") return color;
		if (lineWidth >= 10) return "#FFFFFF";
		const shade = Math.floor((lineWidth / 10) * 15).toString(16); // Calculate shade based on line width // 선 두께에 따라 음영 계산
		return color.replace(/0/g, shade); // Replace '0' in color with the calculated shade // 색상의 '0'을 계산된 음영으로 대체
	}

	draw(ctx) {
		// Draw the branch for the current frame // 현재 프레임에 가지 그리기
		if (this.currentFrame >= this.frames) return true; // If all frames are drawn, return true // 모든 프레임이 그려지면 true 반환

		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);

		this.currentX += this.gapX; // Update the current X position // 현재 X 좌표 업데이트
		this.currentY += this.gapY; // Update the current Y position // 현재 Y 좌표 업데이트

		ctx.lineTo(this.currentX, this.currentY);
		ctx.lineWidth = this.getAdjustedLineWidth();
		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.closePath();

		this.currentFrame++; // Increment the frame counter // 프레임 카운터 증가
		return false; // Return false as the animation is not complete // 애니메이션이 완료되지 않았으므로 false 반환
	}

	getAdjustedLineWidth() {
		// Adjust the line width based on its original value // 원래 값에 따라 선 두께 조정
		if (this.lineWidth < 3) return 0.5;
		if (this.lineWidth < 7) return this.lineWidth * 0.7;
		if (this.lineWidth < 10) return this.lineWidth * 0.9;
		return this.lineWidth;
	}
}

/*
  - adjustColorForLineWidth() 함수는 선 두께에 따라 색상을 조정
    이 함수는 색상이 검정색일 경우 조정 없이 그대로 반환하고,
    선 두께가 10 이상일 경우 흰색으로 설정
    두께가 그 이하일 경우, 두께를 기준으로 음영을 계산하여 색상에 적용

  - draw() 함수는 현재 프레임의 가지를 그림
    이 함수는 프레임 카운터를 증가시키며, 모든 프레임이 그려지면 true를 반환하여 애니메이션이 완료되었음을 나타냄

  - getAdjustedLineWidth() 함수는 선 두께를 조정하여 애니메이션 효과
    두께가 작을수록 더 얇은 선을 사용하며, 두께가 클수록 원래 두께를 유지
*/

/*
  - Branch 클래스는 나무의 가지를 표현
  - adjustColorForLineWidth() 메서드는 가지 두께에 따라 색상을 조정하며,
    draw() 메서드는 가지를 현재 프레임에 맞게 그림
  - getAdjustedLineWidth() 메서드는 가지 두께를 조정하여 애니메이션 효과를 줌
  - 애니메이션 프레임이 완료되면 draw() 메서드는 true를 반환

  - Tree 클래스와 함께 사용되어 가지의 애니메이션을 처리
*/

/* 
  관련 MDN 문서:
  - [CanvasRenderingContext2D.beginPath()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath)
  - [CanvasRenderingContext2D.moveTo()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo)
  - [CanvasRenderingContext2D.lineTo()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineTo)
  - [CanvasRenderingContext2D.lineWidth](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineWidth)
  - [CanvasRenderingContext2D.strokeStyle](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/strokeStyle)
  - [CanvasRenderingContext2D.stroke()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/stroke)
  - [CanvasRenderingContext2D.closePath()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/closePath)
*/

/*
export class Branch {
	constructor(startX, startY, endX, endY, lineWidth, color) {
		this.startX = startX;
		this.startY = startY;
		this.endX = endX;
		this.endY = endY;
		this.color = color;
		this.lineWidth = lineWidth;

		this.frame = 10;
		this.cntFrame = 0;

		this.gapX = (this.endX - this.startX) / this.frame;
		this.gapY = (this.endY - this.startY) / this.frame;

		this.currentX = this.startX;
		this.currentY = this.startY;

		this.setColor();
	}

	draw(ctx) {
		if (this.cntFrame === this.frame) return true;

		ctx.beginPath();

		this.currentX += this.gapX;
		this.currentY += this.gapY;

		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.currentX, this.currentY);

		if (this.lineWidth < 3) {
			ctx.lineWidth = 0.5;
		} else if (this.lineWidth < 7) {
			ctx.lineWidth = this.lineWidth * 0.7;
		} else if (this.lineWidth < 10) {
			ctx.lineWidth = this.lineWidth * 0.9;
		} else {
			ctx.lineWidth = this.lineWidth;
		}

		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;

		ctx.stroke();
		ctx.closePath();

		this.cntFrame++;
		return false;
	}

	setColor() {
		if (this.color !== "#000000") {
			if (this.lineWidth >= 10) {
				this.color = "#FFFFFF";
			} else {
				let num = Math.floor((this.lineWidth / 10) * 15).toString(16);
				this.color = this.color.replace(/0/gi, num);
			}
		}
	}
}
*/
