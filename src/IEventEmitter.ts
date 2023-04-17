export interface Listener<T> {
  (event: T, payload: string): any
}

export interface Disposable {
  dispose: () => void
}

export interface IEventEmitter<T extends string> {
  listeners: { [key in T]?: Listener<T>[] }
  listenersOncer: { [key in T]?: Listener<T>[] }

  on: (topic: T, listener: Listener<T>) => Disposable

  once: (topic: T, listener: Listener<T>) => void

  off: (topic: T, listener: Listener<T>) => void

  emit: (topic: T, event: T) => void

  pipe: (topic: T, te: IEventEmitter<T>) => Disposable
}
