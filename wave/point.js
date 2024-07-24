export class Point {
	constructor(index, x, y) {
		// Initialize the x and y coordinates
		// x, y 좌표 초기화
		this.x = x;
		this.y = y;

		// Store the initial y coordinate as a fixed value
		// 초기 y 좌표를 고정 값으로 저장
		this.fixedY = y;

		// Set the speed of the wave motion
		// 파동 운동의 속도 설정
		this.speed = 0.1;

		// Initialize the current position index
		// 현재 위치 인덱스를 초기화
		this.cur = index;

		// Set the maximum amplitude of the wave motion
		// 파동 운동의 최대 진폭을 설정 ... 위 아래로 움직이는 간격
		this.max = Math.random() * 100 + 150;
	}

	update() {
		// Increase the current position index by the speed
		// 현재 위치 인덱스를 속도만큼 증가
		this.cur += this.speed;

		// Update the y coordinate using a sine wave function
		// sin 함수를 사용하여 y 좌표를 업데이트
		this.y = this.fixedY + Math.sin(this.cur) * this.max;
	}
}

/**
 * Links to relevant MDN Web Docs:
 * - `Math.random()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * - `Math.sin()`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sin
 */
