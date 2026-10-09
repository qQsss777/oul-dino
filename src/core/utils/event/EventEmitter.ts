type EventCallback<T = unknown> = (data: T) => void;
export interface IHandler {
  remove: () => void;
}
interface IEventEmitterProperties {
  on<T = unknown>(eventName: string, callback: EventCallback<T>): IHandler;
  emit<T>(eventName: string, data?: T): void;
}

export default abstract class EventEmitter implements IEventEmitterProperties {
  private eventsRegistered = new Map<string, EventCallback<any>[]>();

  on<T = unknown>(eventName: string, callback: EventCallback<T>): IHandler {
    const eventNameInMap = this.eventsRegistered.get(eventName);
    if (eventNameInMap) {
      eventNameInMap.push(callback as EventCallback<any>);
    } else {
      this.eventsRegistered.set(eventName, [callback as EventCallback<any>]);
    }

    const remove = () => {
      const allValidCb = eventNameInMap?.filter((cb) => cb !== callback);
      this.eventsRegistered.set(eventName, allValidCb ?? []);
    };
    return { remove };
  }

  emit<T>(eventName: string, data?: T): void {
    const eventNameInMap = this.eventsRegistered.get(eventName);
    if (eventNameInMap) {
      eventNameInMap.forEach((evCb) => {
        evCb(data);
      });
    }
  }
}
