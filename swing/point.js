export class Point {
	constructor(x, y) {
		// Initialize the point with given x and y coordinates, or default to 0
		// 주어진 x와 y 좌표로 점을 초기화하거나, 기본값으로 0을 설정함
		this.x = x || 0;
		this.y = y || 0;
	}

	add(point) {
		// Add the coordinates of another point to this point
		// 다른 점의 좌표를 현재 점에 더함
		this.x += point.x;
		this.y += point.y;
		return this;
	}

	subtract(point) {
		// Subtract the coordinates of another point from this point
		// 다른 점의 좌표를 현재 점에서 빼는 연산 수행함
		this.x -= point.x;
		this.y -= point.y;
		return this;
	}

	reduce(value) {
		// Scale the point's coordinates by the given value
		// 주어진 값으로 점의 좌표를 스케일 조정함
		this.x *= value;
		this.y *= value;
		return this;
	}

	collide(point, width, height) {
		// Check if this point collides with a rectangular area
		// 현재 점이 직사각형 영역과 충돌하는지 확인함
		if (
			this.x >= point.x &&
			this.x <= point.x + width &&
			this.y >= point.y &&
			this.y <= point.y + height
		) {
			return true;
		} else {
			return false;
		}
	}

	clone() {
		// Return a new instance of Point with the same coordinates
		// 동일한 좌표를 가진 새로운 Point 인스턴스를 반환함
		return new Point(this.x, this.y);
	}
}

/**
 * Links to relevant MDN Web Docs:
 * - `|| (Logical OR)`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
 * - `Math operations in JavaScript`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#mathematical_operators
 * - `if...else statement`: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else
 * - `Object.prototype.clone`: (General reference for cloning objects) https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#cloning_objects
 */
