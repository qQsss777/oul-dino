import type Actor from "../actor/actor";

interface IInputConstructor {
	label: string;
	name: string;
}

interface IInputProperties extends IInputConstructor {
	execute: (data?: any) => void;
}

abstract class Input<T> implements IInputProperties {
	label: string;
	name: string;
	assetInstance: Actor | undefined;

	constructor(properties: IInputConstructor) {
		this.label = properties.label;
		this.name = properties.name;
	}

	setInstance(asset: Actor) {
		this.assetInstance = asset;
	}

	abstract execute(data?: T): void;
}

export default Input;
