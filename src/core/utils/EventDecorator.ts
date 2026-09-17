export function emitEvent(eventName: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = function (this: any, ...args: any[]) {
      const result = originalMethod.apply(this, args);
      if (this.emit) this.emit(eventName);
      return result;
    };
  };
}
