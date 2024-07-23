import { GlowParticle } from "./glowparticle.js";

const COLORS = [
	{ r: 45, g: 74, b: 227 }, //blue
	{ r: 250, g: 255, b: 89 }, //yellow
	{ r: 255, g: 104, b: 248 }, //purple
	{ r: 44, g: 209, b: 252 }, //skyblue
	{ r: 54, g: 233, b: 84 }, //green
];

class App {
	constructor() {
		this.canvas = document.createElement("canvas");
		document.body.appendChild(this.canvas); // 캔버스를 문서의 body에 추가
		this.ctx = this.canvas.getContext("2d"); // 2D 컨텍스트 가져오기

		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
		// 고해상도 디스플레이를 위한 픽셀 비율 설정..  physical pixel resolution : CSS pixel resolution 의 비율을 나타낸 값

		this.totalParticles = 15;
		this.particles = [];
		this.maxRadius = 500;
		this.minRadius = 100;

		window.addEventListener("resize", this.resize.bind(this), false); // 창 크기 변경 시 resize 메서드 호출
		this.resize(); // 초기 크기 조정

		window.requestAnimationFrame(this.animate.bind(this)); // 애니메이션 시작
	}

	resize() {
		this.stageWidth = document.body.clientWidth; // 문서의 너비
		this.stageHeight = document.body.clientHeight; // 문서의 높이

		this.canvas.width = this.stageWidth * this.pixelRatio; // 캔버스 너비 조정
		this.canvas.height = this.stageHeight * this.pixelRatio; // 캔버스 높이 조정
		this.ctx.scale(this.pixelRatio, this.pixelRatio); // 스케일 조정

		this.ctx.globalCompositeOperation = "saturation"; // 합성 작업을 "saturation"으로 설정

		this.createParticles(); // 파티클 생성
	}

	createParticles() {
		let curColor = 0; // 현재 색상 인덱스
		this.particles = []; // 파티클 배열 초기화

		for (let i = 0; i < this.totalParticles; i++) {
			const item = new GlowParticle(
				Math.random() * this.stageWidth, // 랜덤 x 위치
				Math.random() * this.stageHeight, // 랜덤 y 위치
				Math.random() * (this.maxRadius - this.minRadius) +
					this.minRadius, // 랜덤 반지름
				COLORS[curColor] // 색상 설정
			);

			if (++curColor >= COLORS.length) {
				curColor = 0; // 색상 인덱스가 배열 길이를 넘으면 초기화...  '++' -> curColor 값을 먼저 증가시키고 나서 비교 (전위 증가 연산)
			}

			this.particles[i] = item; // 파티클 배열에 추가
		}
	}

	animate() {
		window.requestAnimationFrame(this.animate.bind(this)); // 다음 애니메이션 프레임 요청

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight); // 캔버스 초기화

		for (let i = 0; i < this.totalParticles; i++) {
			const item = this.particles[i]; // 각 파티클에 대해
			item.animate(this.ctx, this.stageWidth, this.stageHeight); // 애니메이션 수행
		}
	}
}

window.onload = () => {
	new App(); // 페이지 로드 시 App 인스턴스 생성
};
