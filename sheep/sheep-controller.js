import { Sheep } from "./sheep.js";
export class SheepController {
	constructor() {
		this.img = new Image();
		this.img.onload = () => {
			this.loaded();
		};
		this.img.src = "sheep.png";

		this.items = [];

		this.cur = 0;
		// Initialize the current frame counter
		// 현재 프레임 카운터를 초기화
		this.isLoaded = false;
		// Initialize the loaded flag
		// 로드된 플래그를 초기화
	}

	resize(stageWidth, stageHeight) {
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;
	}

	loaded() {
		this.isLoaded = true;
		// Set the loaded flag to true
		// 로드된 플래그를 true로 설정
		this.addSheep();
		// Add a sheep
		// 양을 추가
	}

	addSheep() {
		this.items.push(new Sheep(this.img, this.stageWidth));
		// Add a new sheep to the items array
		// items 배열에 새로운 양을 추가
	}

	draw(ctx, t, dots) {
		if (this.isLoaded) {
			// Check if the image is loaded
			// 이미지가 로드되었는지 확인
			this.cur += 1;
			// Increment the current frame counter
			// 현재 프레임 카운터를 증가시킴
			if (this.cur > 200) {
				this.cur = 0;
				// Reset the counter
				// 카운터를 리셋
				this.addSheep();
				// Add a new sheep
				// 새로운 양을 추가합
			}

			for (let i = this.items.length - 1; i >= 0; i--) {
				// Loop through the items array in reverse
				// items 배열을 역순으로 순회
				/* 배열의 요소를 순회하면서 제거할 때, 정순으로 순회하면 요소를 제거한 후의 인덱스가 변하게 되어
				다음 요소를 제대로 순회할 수 없게 되는데 역순으로 순회하면 이러한 인덱스 변동 문제를 피할 수 있음 */
				const item = this.items[i];
				// Get the current item
				// 현재 아이템을 가져옴
				if (item.x < -item.width) {
					// Check if the item is out of the screen
					// 아이템이 화면 밖에 있는지 확인
					this.items.splice(i, 1);
					// Remove the item from the array
					// 배열에서 아이템을 제거
				} else {
					item.draw(ctx, t, dots);
				}
			}
		}
	}
}

/* 
	JavaScript - MDN Web Docs:
	- Image: https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
	- Array.splice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
	- requestAnimationFrame: https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
*/
