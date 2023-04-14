export interface Listener<T> {
  (event: T): any
}

export interface Disposable {
  dispose: () => void
}

export interface IEventEmitter<T extends string, K> {
  listeners: { [key in T]?: Listener<K>[] }
  listenersOncer: { [key in T]?: Listener<K>[] }

  on: (topic: T, listener: Listener<K>) => Disposable

  once: (topic: T, listener: Listener<K>) => void

  off: (topic: T, listener: Listener<K>) => void

  emit: (topic: T, event: K) => void

  pipe: (topic: T, te: IEventEmitter<T, K>) => Disposable
}
