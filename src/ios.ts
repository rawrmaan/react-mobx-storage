import { IStorageEngine } from './storage'

import { AsyncStorage } from 'react-native'

const Implementation: IStorageEngine = {
  get(key) {
    return AsyncStorage.getItem(key).then(val => JSON.parse(val))
  },
  save(key, value) {
    // AsyncStorage throws an exception for undefined values
    if (!key || !value) return Promise.resolve()
    return AsyncStorage.setItem(key, JSON.stringify(value))
  },
  delete(key) {
    return AsyncStorage.removeItem(key)
  },
  keys() {
    return AsyncStorage.getAllKeys()
  }
}

export default Implementation
