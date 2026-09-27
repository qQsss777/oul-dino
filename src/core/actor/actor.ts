import MeshAsset, { type IMeshAssetProperties } from "../asset/meshAsset";
import type Input from "../input/input";
import { updating } from "../utils/decorator/UpdatingDecorator";

interface IActorConstructor extends IMeshAssetProperties {
	inputs?: Input<unknown>[];
	updating: boolean;
}

interface IActor extends IActorConstructor {
	addInput(input: Input<unknown>): void;
	move(direction: "left" | "right", speed: number): void;
	jump(speed: number): void;
}

export default class Actor extends MeshAsset implements IActor {
	inputs: Input<unknown>[];
	updating: boolean = false;

	constructor(properties: IActorConstructor) {
		super(properties);
		this.inputs = properties.inputs ?? [];
	}
	load(): Promise<void> {
		throw new Error("Method not implemented.");
	}
	addInput(input: Input<unknown>): void {
		input.assetInstance = this;
		this.inputs.push(input);
	}

	@updating()
	move(direction: "left" | "right", speed: number): void {
		throw new Error("Method not implemented.");
	}
	@updating()
	jump(speed: number) {
		throw new Error("Method not implemented.");
	}
}
