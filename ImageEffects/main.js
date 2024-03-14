const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;

class Cell {
	constructor(effect, x, y) {
		this.effect = effect;
		this.x = x;
		this.y = y;
		this.width = this.effect.cellWidth;
		this.height = this.effect.cellHeight;
		this.img = document.getElementById("prImg");
		this.slideX = 0;
		this.slideY = 0;
		this.vx = 0;
		this.vy = 0;
		this.ease = 0.01;
		this.friction = 0.9;
	}

	draw(context) {
		context.drawImage(
			this.img,
			this.x + this.slideX,
			this.y + this.slideY,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
		//context.strokeRect(this.x, this.y, this.width, this.height);
	}
	update() {
		const dx = this.effect.mouse.x - this.x;
		const dy = this.effect.mouse.y - this.y;
		const distance = Math.hypot(dx, dy);
		if (distance < this.effect.mouse.radius) {
			const angle = Map.atan2(dy, dx);
			const force = distance / this.effect.mouse.radius;
			this.vx = force * Math.cos(angle);
			this.vy = force * Math.sin(angle);
		}
		this.slideX += (this.vx *= this.friction) - this.slideX * this.ease;
		this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
	}
}

class Effect {
	constructor(canvas) {
		this.canvas = canvas;
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.cellWidth = this.width / 50;
		this.cellHeight = this.height / 70;
		this.imgGrid = [];
		this.createGrid();
		this.mouse = {
			x: undefined,
			y: undefined,
			radius: 150,
		};
		this.canvas.addEventListener("mousemove", (e) => {
			this.mouse.x = e.offsetX;
			this.mouse.y = e.offsetY;
		});
		this.canvas.addEventListener("mouseleave", (e) => {
			this.mouse.x = undefined;
			this.mouse.y = undefined;
		});
	}

	createGrid() {
		for (let y = 0; y < this.height; y += this.cellHeight) {
			for (let x = x; x < this.width; x += this.cellWidth) {
				this.imgGrid.push(new Cell(this, x, y));
			}
		}
	}

	render(context) {
		this.imgGrid.forEach((cell, i) => {
			cell.update();
			cell.draw(context);
		});
	}
}

const effect = new Effect(canvas);

function animate() {
	effect.render(ctx);
	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
