/**
 * Calculates the distance between two points (x1, y1) and (x2, y2).
 * 두 점 (x1, y1)과 (x2, y2) 사이의 거리를 계산
 *
 * @param {number} x1 - The x-coordinate of the first point.
 *                      첫 번째 점의 x 좌표
 * @param {number} y1 - The y-coordinate of the first point.
 *                      첫 번째 점의 y 좌표
 * @param {number} x2 - The x-coordinate of the second point.
 *                      두 번째 점의 x 좌표
 * @param {number} y2 - The y-coordinate of the second point.
 *                      두 번째 점의 y 좌표
 * @returns {number} - The distance between the two points.
 *                     두 점 사이의 거리
 */
export function distance(x1, y1, x2, y2) {
	const x = x2 - x1;
	const y = y2 - y1;
	return Math.sqrt(x * x + y * y);
}

/**
 * Checks if a line segment (x1, y1) to (x2, y2) intersects with a circle (cx, cy) with radius r.
 * 선분 (x1, y1)에서 (x2, y2)가 반지름 r인 원 (cx, cy)과 교차하는지 확인
 *
 * @param {number} x1 - The x-coordinate of the first endpoint of the line segment.
 *                      선분의 첫 번째 끝점의 x 좌표
 * @param {number} y1 - The y-coordinate of the first endpoint of the line segment.
 *                      선분의 첫 번째 끝점의 y 좌표
 * @param {number} x2 - The x-coordinate of the second endpoint of the line segment.
 *                      선분의 두 번째 끝점의 x 좌표
 * @param {number} y2 - The y-coordinate of the second endpoint of the line segment.
 *                      선분의 두 번째 끝점의 y 좌표
 * @param {number} cx - The x-coordinate of the circle's center.
 *                      원 중심의 x 좌표
 * @param {number} cy - The y-coordinate of the circle's center.
 *                      원 중심의 y 좌표
 * @param {number} r - The radius of the circle.
 *                     원의 반지름
 * @returns {boolean} - True if the line segment intersects with the circle, otherwise false.
 *                      선분이 원과 교차하면 true, 그렇지 않으면 false
 */
export function lineCircle(x1, y1, x2, y2, cx, cy, r) {
	/* Calculate the length of the line segment.
       선분의 길이를 계산 */
	const lineLength = distance(x1, y1, x2, y2);

	/* Calculate the projection of the circle's center onto the line segment.
       원의 중심을 선분에 투영하여 투영점을 계산 */
	const point =
		((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) /
		Math.pow(lineLength, 2);
	const px = x1 + point * (x2 - x1);
	const py = y1 + point * (y2 - y1);

	/* Check if the distance from the circle's center to the projected point is less than the radius.
       투영점에서 원의 중심까지의 거리가 반지름보다 작은지 확인 */
	if (distance(px, py, cx, cy) < r) {
		return true;
	} else {
		return false;
	}
}
