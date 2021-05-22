import Util from '.'

describe('cryptoHash()', () => {
  it('generates a SHA-256 hashed output', () => {
    expect(Util.genHash('foo')).toEqual(
      'b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b'
    )
  })

  it('produces the same hash with the same input arguments in any order', () => {
    expect(Util.genHash('one', 'two', 'three')).toEqual(Util.genHash('three', 'one', 'two'))
  })

  it('produces a unique hash when the properties have changed on an input', () => {
    const foo: Record<string, string> = {}
    const originalHash = Util.genHash(foo)
    foo['a'] = 'a'

    expect(Util.genHash(foo)).not.toEqual(originalHash)
  })
})
