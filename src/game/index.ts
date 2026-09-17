import Actor from "../core/actor";
import Game from "../core/game";
import scene from "./scene";

// game is for interaction with GameApplication and player inputs
export default new Game({
	scene: scene,
	player: null,
	enemys: [],
});
