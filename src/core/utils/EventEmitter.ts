type EventCallback = <T>(data: T) => void;
interface IEventEmitterProperties {
  on(eventName: string, callback: EventCallback): void;
  emit<T>(eventName: string, data?: T): void;
}

export default abstract class EventEmitter implements IEventEmitterProperties {
  private eventsRegistered = new Map<string, EventCallback[]>();

  on(eventName: string, callback: EventCallback): void {
    const eventNameInMap = this.eventsRegistered.get(eventName);
    if (eventNameInMap) {
      eventNameInMap.push(callback);
    } else {
      this.eventsRegistered.set(eventName, [callback]);
    }
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
