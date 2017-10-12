export interface IStorage {
  loadInto(domain: string, key: string, object: any): Promise<any>
  loadAllInto(domain: string, keys: Array<string>, object: any): Promise<any>
  get(domain: string, key: string): Promise<any>
  save(domain: string, key: string, value: any): Promise<any>
  delete(domain: string, key: string): Promise<any>
  deleteAll(domain: string, keys: Array<string>): Promise<any>
  keys(): Promise<Array<string>>
  bindToDomain<T>(domain: string, context: T): IStorageBound<T>
}

export interface IStorageBound<T> {
  loadAll(keys: Array<keyof T>): Promise<any>
  get<K extends keyof T>(key: K): Promise<T[K]>
  save<K extends keyof T>(key: keyof T, value: T[K]): Promise<any>
  delete(key: keyof T): Promise<any>
  deleteAll(keys: Array<keyof T>): Promise<any>
}

// Storage Layer Implementation
export interface IStorageEngine {
  get(key: string): Promise<any>
  save(key: string, value: any): Promise<any>
  delete(key: string): Promise<any>
  keys(): Promise<Array<string>>
}
