type EventCallback = <T>(data: T) => void;
export interface IHandler {
  remove: () => void;
}
interface IEventEmitterProperties {
  on(eventName: string, callback: EventCallback): IHandler;
  emit<T>(eventName: string, data?: T): void;
}

export default abstract class EventEmitter implements IEventEmitterProperties {
  private eventsRegistered = new Map<string, EventCallback[]>();

  on(eventName: string, callback: EventCallback): IHandler {
    const eventNameInMap = this.eventsRegistered.get(eventName);
    if (eventNameInMap) {
      eventNameInMap.push(callback);
    } else {
      this.eventsRegistered.set(eventName, [callback]);
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
