import Input from "./input";

export interface IJumpInputPayload {
	speed: number;
	distance: number;
}

class JumpInput extends Input<IJumpInputPayload> {
	execute(data?: IJumpInputPayload | undefined): void {
		if (data && this.assetInstance) {
			this.assetInstance?.jump(data?.speed);
		}
	}
}

export default JumpInput;
