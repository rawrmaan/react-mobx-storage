import { IStorageEngine } from './storage'

const storage = {}

const Implementation: IStorageEngine = {
  get(key) {
    return Promise.resolve(storage[key])
  },
  save(key, value) {
    storage[key] = value
    return Promise.resolve()
  },
  delete(key) {
    delete storage[key]
    return Promise.resolve()
  },
  keys() {
    return Promise.resolve(Object.keys(storage))
  }
}

export default Implementation
