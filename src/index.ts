import { ObservableMap } from 'mobx'
import {
  IPersistLayer,
  IPersistLayerBound,
  IPersistLayerImplementation
} from './persist'

export class PersistLayerBound<T> implements IPersistLayerBound<T> {
  _persistLayer: IPersistLayer
  _domain: string
  _context: T

  constructor(persistLayer: IPersistLayer, domain: string, context: T) {
    this._persistLayer = persistLayer
    this._context = context
    this._domain = domain
  }

  loadAll(keys: Array<keyof T>): Promise<any> {
    return this._persistLayer.loadAllInto(this._domain, keys, this._context)
  }

  get<K extends keyof T>(key: K): Promise<T[K]> {
    return this._persistLayer.get(this._domain, key)
  }

  save<K extends keyof T>(key: keyof T, value: T[K]): Promise<any> {
    return this._persistLayer.save(this._domain, key, value)
  }

  delete(key: keyof T): Promise<any> {
    return this._persistLayer.delete(this._domain, key)
  }

  deleteAll(keys: Array<keyof T>): Promise<any> {
    return this._persistLayer.deleteAll(this._domain, keys)
  }
}

export default class PersistLayer implements IPersistLayer {
  _namespace: string
  _implementation: IPersistLayerImplementation

  constructor(namespace: string, implementation: IPersistLayerImplementation) {
    this._namespace = namespace
    this._implementation = implementation
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
    return this._implementation.get(`${this._namespace}.${domain}.${key}`)
  }

  save(domain: string, key: string, value: any) {
    return this._implementation.save(
      `${this._namespace}.${domain}.${key}`,
      value
    )
  }

  delete(domain: string, key: string) {
    return this._implementation.delete(`${this._namespace}.${domain}.${key}`)
  }

  deleteAll(domain: string, keys: Array<string>) {
    return Promise.all(keys.map(key => this.delete(domain, key)))
  }

  keys() {
    return this._implementation.keys()
  }

  bindToDomain<T>(domain: string, context: T): PersistLayerBound<T> {
    return new PersistLayerBound(this, domain, context)
  }
}
