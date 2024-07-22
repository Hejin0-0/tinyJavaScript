import { Ball } from "./ball.js";
import { Block } from "./block.js";

class App {
	constructor() {
		this.canvas = document.createElement("canvas"); // 캔버스 요소를 생성
		this.ctx = this.canvas.getContext("2d"); // 2D 컨텍스트를 가져오고

		document.body.appendChild(this.canvas); // 생성한 캔버스를 body에 추가합

		window.addEventListener("resize", this.resize.bind(this), false);
		/*
        // 윈도우 크기 조정 이벤트를 등록
        JavaScript에서 함수가 호출되는 방식에 따라 this의 값이 달라질 수 있는데
        이벤트 리스너로 전달된 함수는 일반적으로 이벤트 대상(여기서는 window)을 this로 가진다.
        하지만 이 코드에서는 'resize' 메서드가 'App' 인스턴스의 컨텍스트에서 실행되기를 원한다.
        'bind(this)'를 사용하면 'resize' 메서드가 항상 'App' 인스턴스를 'this'로 사용하도록 새로운 함수를 생성하게 되면서
        'resize' 메서드 내에서 'this.stageWidth', 'this.stageHeight' 등의 App 인스턴스 속성에 접근이 가능.
        */

		this.resize(); // 초기 크기 조정

		this.ball = new Ball(this.stageWidth, this.stageHeight, 60, 15); // Ball 객체를 생성
		this.block = new Block(700, 30, 300, 450); // Block 객체를 생성
		window.requestAnimationFrame(this.animate.bind(this)); // 애니메이션
	}

	resize() {
		this.stageWidth = document.body.clientWidth; // 현재 문서의 너비
		this.stageHeight = document.body.clientHeight; // 현재 문서의 높이

		this.canvas.width = this.stageWidth * 2; // 캔버스 너비를 두 배로 설정
		this.canvas.height = this.stageHeight * 2; // 캔버스 높이를 두 배로 설정
		this.ctx.scale(2, 2);
	}

	animate(t) {
		window.requestAnimationFrame(this.animate.bind(this)); // 다음 애니메이션 프레임을 요청

		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
		this.block.draw(this.ctx);
		this.ball.draw(this.ctx, this.stageWidth, this.stageHeight, this.block);
	}
}

window.onload = () => {
	new App();
};
