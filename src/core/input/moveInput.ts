import Input from "./input";

export interface IMoveInputPayload {
	direction: "right" | "left";
	speed: number;
}

class MoveInput extends Input<IMoveInputPayload> {
	execute(data?: IMoveInputPayload | undefined): void {
		if (this.assetInstance && data) {
			this.assetInstance.move(data.direction, data.speed);
		}
	}
}

export default MoveInput;
