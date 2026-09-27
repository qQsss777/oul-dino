import type Scene from "../scene/scene";
import { emitEvent } from "../utils/decorator/EventDecorator";
import EventEmitter from "../utils/event/EventEmitter";

interface IGameConstructor {
	scene: Scene;
}

interface IGameProperties extends IGameConstructor {
	askUpdate: (deltaTime: number) => void;
	updateLevel: () => void;
}

export default class Game extends EventEmitter implements IGameProperties {
	scene: Scene;
	lastTimeUpdate = 0;

	constructor(properties: IGameConstructor) {
		super();
		this.scene = properties.scene;
	}

	@emitEvent("udapte-asked")
	askUpdate(deltaTime: number) {
		this.lastTimeUpdate = this.lastTimeUpdate + deltaTime;
	}

	@emitEvent("changed")
	updateLevel() {
		console.log("ooo");
	}
}
