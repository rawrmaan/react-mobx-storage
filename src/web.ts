import { IStorageEngine } from './storage'

import * as localForage from 'localforage'

const Implementation: IStorageEngine = {
  get(key) {
    return localForage.getItem(key)
  },
  save(key, value) {
    return localForage.setItem(key, value)
  },
  delete(key) {
    return localForage.removeItem(key)
  },
  keys() {
    return localForage.keys()
  }
}

export default Implementation
