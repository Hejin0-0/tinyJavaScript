export class Block {
	constructor(width, height, x, y) {
		this.width = width; // 블록의 너비
		this.height = height; // 블록의 높이
		this.x = x; // 블록의 x 위치
		this.y = y; // 블록의 y 위치
		this.maxX = width + x; // 블록의 오른쪽 경계 x 좌표
		this.maxY = height + y; // 블록의 아래쪽 경계 y 좌표
	}

	draw(ctx) {
		const xGap = 80; // 블록의 기울기 효과를 위한 x 방향 간격
		const yGap = 60; // 블록의 기울기 효과를 위한 y 방향 간격

		ctx.fillStyle = "#ff384e";
		ctx.beginPath(); // 새 경로를 시작
		ctx.rect(this.x, this.y, this.width, this.height); // 블록의 사각형을 정의
		ctx.fill();

		ctx.fillStyle = "#190f3a"; // 블록의 기울기 색상 설정
		ctx.beginPath(); // 새 경로를 시작
		ctx.moveTo(this.maxX, this.maxY); // 블록의 오른쪽 아래 모서리로 이동
		ctx.lineTo(this.maxX - xGap, this.maxY + yGap); // 기울기의 오른쪽 아래로 선을 그림.
		ctx.lineTo(this.x - xGap, this.maxY + yGap); // 기울기의 왼쪽 아래로 선을 그림.
		ctx.lineTo(this.x, this.maxY); // 블록의 아래쪽 모서리로 돌아오는 선을 그림.
		ctx.fill(); // 기울기 부분을 채워서 기울기 효과를 그림.

		ctx.fillStyle = "#9d0919"; // 블록의 기울기 색상 설정
		ctx.beginPath(); // 새 경로를 시작
		ctx.moveTo(this.x, this.y); // 블록의 왼쪽 위 모서리로 이동
		ctx.lineTo(this.x, this.maxY); // 블록의 왼쪽 아래 모서리로 선을 그림.
		ctx.lineTo(this.x - xGap, this.maxY + yGap); // 기울기의 왼쪽 아래로 선을 그림
		ctx.lineTo(this.x - xGap, this.maxY + yGap - this.height); // 기울기의 왼쪽 위로 선을 그림
		ctx.fill(); // 기울기 부분을 채워서 기울기 효과를 그림.
	}
}
