export function updating() {
	return (
		// biome-ignore lint/suspicious/noExplicitAny: decorator
		_target: any,
		_propertyKey: string,
		descriptor: PropertyDescriptor,
	) => {
		const originalMethod = descriptor.value;
		// biome-ignore lint/suspicious/noExplicitAny: decorator
		descriptor.value = function (this: any, ...args: any[]) {
			this.updating = true;
			const result = originalMethod.apply(this, args);
			this.updating = false;
			return result;
		};
	};
}
