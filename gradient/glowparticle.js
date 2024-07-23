const PI2 = Math.PI * 2; // 2 * PI 값, 원의 전체 각도

export class GlowParticle {
	constructor(x, y, radius, rgb) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.rgb = rgb;

		this.vx = Math.random() * 4; // 파티클의 x축 속도 (velocity in the x direction)
		this.vy = Math.random() * 4; // 파티클의 y축 속도 (velocity in the y direction)

		this.sinValue = Math.random(); // 파티클의 진동값 초기화
	}

	animate(ctx, stageWidth, stageHeight) {
		this.sinValue += 0.01; // 진동값 증가

		this.radius += Math.sin(this.sinValue); // 반지름에 진동값 적용

		this.x += this.vx; // x축 위치 갱신
		this.y += this.vy; // y축 위치 갱신

		// 경계 검사 및 반사
		if (this.x < 0) {
			this.vx *= -1;
			this.x += 10;
		} else if (this.x > stageWidth) {
			this.vx *= -1;
			this.x -= 10;
		}

		if (this.y < 0) {
			this.vy *= -1;
			this.y += 10;
		} else if (this.y > stageHeight) {
			this.vy *= -1;
			this.y -= 10;
		}

		ctx.beginPath(); // 새로운 경로 시작
		const g = ctx.createRadialGradient(
			this.x, // 원 중심의 x 좌표
			this.y, // 원 중심의 y 좌표
			this.radius * 0.01, // 시작 반지름
			this.x, // 원 끝의 x 좌표
			this.y, // 원 끝의 y 좌표
			this.radius // 끝 반지름
		);
		g.addColorStop(
			0,
			`rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`
		); // 중심 색상
		g.addColorStop(
			1,
			`rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0`
		); // 외곽 색상
		ctx.fillStyle = g; // 채우기 스타일을 방사형 그라디언트로 설정
		ctx.arc(this.x, this.y, this.radius, 0, PI2, false); // 원을 그립니다.
		ctx.fill(); // 경로를 채워서 파티클을 그립니다.
	}
}

/*

' sinValue '

    초기화:
        this.sinValue = Math.random();에서 sinValue는 0과 1 사이의 랜덤 값으로 초기화되는데 이는 파티클마다 진동 시작점이 다르게 하기 위함

    진동 값 갱신:
        this.sinValue += 0.01;에서 sinValue는 매 프레임마다 0.01씩 증가하는데 이로 인해 sinValue는 시간에 따라 점진적으로 증가

    반지름 진동:
        this.radius += Math.sin(this.sinValue);에서 Math.sin(this.sinValue)는 sinValue를 사용하여 사인파 값을 계산하는데
        sin 함수는 주기적으로 -1에서 1 사이의 값을 반환함. 따라서, this.radius에 sn 값을 더하면 반지름이 주기적으로 증가하고 감소하는 진동 효과를 보임

예시)

    sinValue가 0일 때: Math.sin(0) = 0 이므로 반지름 변화 없음.
    sinValue가 π/2일 때: Math.sin(π/2) = 1 이므로 반지름이 1만큼 증가.
    sinValue가 π일 때: Math.sin(π) = 0 이므로 반지름 변화 없음.
    sinValue가 3π/2일 때: Math.sin(3π/2) = -1 이므로 반지름이 1만큼 감소.
    sinValue가 2π일 때: Math.sin(2π) = 0 이므로 반지름 변화 없음.

이 과정을 통해 파티클의 반지름이 주기적으로 변동하여, 파티클이 실제로 진동하는 것처럼 보이되며 sinValue는 이러한 진동 효과를 시간에 따라 부드럽게 만들어주는 역할

*/
