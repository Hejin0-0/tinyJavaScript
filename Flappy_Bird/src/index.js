/* https://phaser.io/ */

import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import PauseScene from "./scenes/PauseScene";

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
	width: WIDTH,
	height: HEIGHT,
	startPosition: BIRD_POSITION,
};

// [2] const Scenes = [PreloadScene, MenuScene, PlayScene];
// const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG));
const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
	// WebGL (Web graphics librar) JS for rendering 2D and 3D graphics
	type: Phaser.AUTO,
	...SHARED_CONFIG,
	physics: {
		// Arcade physics plugin, manages physics simulation
		default: "arcade",
		arcade: {
			//debug: true,
		},
	},
	//  [1] scene: [
	// 	PreloadScene,
	// 	new MenuScene(SHARED_CONFIG),
	// 	new PlayScene(SHARED_CONFIG),
	// ],
	scene: initScenes(), // [2][3]
};

new Phaser.Game(config);
