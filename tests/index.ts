import { expect } from 'chai'

import Storage from '../src/index'
import MemoryEngine from '../src/memory'

describe('Storage', () => {
  const layer = new Storage('test', MemoryEngine)
  it('saves and loads a value', async () => {
    await layer.save('d', 'x', 'y')
    expect(await layer.get('d', 'x')).to.equal('y')
  })

  it('saves to the correct key path', async () => {
    await layer.save('a', 'b', 'c')
    expect(await MemoryEngine.get('test.a.b')).to.equal('c')
  })
})

describe('StorageBound', () => {
  const context = {
    a: 1,
    b: '2',
    c: ['3']
  }
  const layer = new Storage('test', MemoryEngine).bindToDomain('d', context)

  it('saves and loads a value', async () => {
    await layer.save('a', context.a)
    expect(await layer.get('a')).to.equal(context.a)
  })

  it('deletes a value', async () => {
    await layer.save('b', context.b)
    await layer.delete('b')
    expect(await layer.get('b')).to.be.undefined
  })

  it('saves to the correct key path', async () => {
    await layer.save('c', 'd')
    expect(await MemoryEngine.get('test.d.c')).to.equal('d')
  })
})
