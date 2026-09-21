export function emitEvent(eventName: string) {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: decorator
		_target: any,
		_propertyKey: string,
		descriptor: PropertyDescriptor,
	) => {
		const originalMethod = descriptor.value;
		// biome-ignore lint/suspicious/noExplicitAny: decorator
		descriptor.value = function (this: any, ...args: any[]) {
			const result = originalMethod.apply(this, args);
			if (this.emit) this.emit(eventName);
			return result;
		};
	};
}
