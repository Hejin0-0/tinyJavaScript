// Calculate the distance between two points
// 두 점 사이의 거리 계산
export function distance(x1, y1, x2, y2) {
	const x = x2 - x1; // Calculate the difference in x coordinates // x 좌표의 차이 계산
	const y = y2 - y1; // Calculate the difference in y coordinates // y 좌표의 차이 계산
	return Math.sqrt(x * x + y * y); // Use the Pythagorean theorem to calculate the distance // 피타고라스의 정리를 사용하여 거리 계산
}

// Check if a point is within a given radius from another point
// 한 점이 다른 점으로부터 주어진 반지름 내에 있는지 확인
export function collide(x1, y1, x2, y2, radius) {
	if (distance(x1, y1, x2, y2) <= radius) {
		// Use the distance function to determine if the point is within the radius // 거리 함수를 사용하여 점이 반지름 내에 있는지 확인
		return true; // Return true if within the radius // 반지름 내에 있으면 true 반환
	} else {
		return false; // Return false if not within the radius // 반지름 내에 없으면 false 반환
	}
}

/*
Related Code Explanation:
- The `distance` function is used to calculate the Euclidean distance between two points. This function is utilized in `Ripple` class to determine the maximum radius of the ripple effect.
- The `collide` function checks if a point is within a certain radius from another point. This is used in `app.js` to detect collisions between the ripple effect and dots.

distance(x1, y1, x2, y2)
    두 점 (x1,y1)(x1,y1)과 (x2,y2)(x2,y2) 사이의 유클리드 거리(Euclidean distance)를 계산합니다. 피타고라스의 정리를 사용하여 두 점 간의 직선 거리를 반환합니다.

collide(x1, y1, x2, y2, radius)
    두 점 (x1,y1)(x1,y1)과 (x2,y2)(x2,y2) 사이의 거리가 주어진 반지름(radius) 이하인지를 확인합니다. 거리 함수(distance)를 사용하여 두 점 사이의 거리를 측정하고, 그 거리가 반지름보다 작거나 같으면 충돌로 간주하여 true를 반환합니다.


References:
- `Math.sqrt()` method documentation: [MDN Web Docs: Math.sqrt()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt)
*/
