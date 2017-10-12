import { ObservableMap } from 'mobx'
import { IStorage, IStorageBound, IStorageEngine } from './storage'

export class StorageBound<T> implements IStorageBound<T> {
  _storage: IStorage
  _domain: string
  _context: T

  constructor(storage: IStorage, domain: string, context: T) {
    this._storage = storage
    this._context = context
    this._domain = domain
  }

  loadAll(keys: Array<keyof T>): Promise<any> {
    return this._storage.loadAllInto(this._domain, keys, this._context)
  }

  get<K extends keyof T>(key: K): Promise<T[K]> {
    return this._storage.get(this._domain, key)
  }

  save<K extends keyof T>(key: keyof T, value: T[K]): Promise<any> {
    return this._storage.save(this._domain, key, value)
  }

  delete(key: keyof T): Promise<any> {
    return this._storage.delete(this._domain, key)
  }

  deleteAll(keys: Array<keyof T>): Promise<any> {
    return this._storage.deleteAll(this._domain, keys)
  }
}

export default class Storage implements IStorage {
  _namespace: string
  _engine: IStorageEngine

  constructor(namespace: string, engine: IStorageEngine) {
    this._namespace = namespace
    this._engine = engine
  }

  loadInto(domain: string, key: string, object: any) {
    return this.get(domain, key).then(result => {
      // Make sure we don't set keys that are null
      if (result) {
        if (object[key] instanceof ObservableMap) {
          object[key].merge(result)
        } else {
          object[key] = result
        }
      }
    })
  }

  loadAllInto(domain: string, keys: Array<string>, object: any) {
    return Promise.all(keys.map(key => this.loadInto(domain, key, object)))
  }

  get(domain: string, key: string) {
    return this._engine.get(`${this._namespace}.${domain}.${key}`)
  }

  save(domain: string, key: string, value: any) {
    return this._engine.save(`${this._namespace}.${domain}.${key}`, value)
  }

  delete(domain: string, key: string) {
    return this._engine.delete(`${this._namespace}.${domain}.${key}`)
  }

  deleteAll(domain: string, keys: Array<string>) {
    return Promise.all(keys.map(key => this.delete(domain, key)))
  }

  keys() {
    return this._engine.keys()
  }

  bindToDomain<T>(domain: string, context: T): StorageBound<T> {
    return new StorageBound(this, domain, context)
  }
}
