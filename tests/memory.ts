/// <reference path="../node_modules/@types/mocha/index.d.ts" />
import { expect } from 'chai'

import Engine from '../src/memory'

describe('StorageEngineMemory', () => {
  before(async () => {
    // Clear key/val pairs that may have been set by other tests
    for (let key of await Engine.keys()) {
      await Engine.delete(key)
    }
  })

  it('saves and loads a value', async () => {
    await Engine.save('x', 'y')
    expect(await Engine.get('x')).to.equal('y')
  })

  it('deletes a value', async () => {
    await Engine.save('x', 'y')
    await Engine.delete('x')
    expect(await Engine.get('x')).to.be.undefined
  })

  it('returns stored keys', async () => {
    await Engine.save('x', 'y')
    await Engine.save('y', 'z')
    expect(await Engine.keys()).to.deep.equal(['x', 'y'])
  })
})
