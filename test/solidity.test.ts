import {assert} from 'chai'

import {Compiler} from '../src/compiler'

describe('compiler', () => {
  describe('solidity version', () => {
    let c = new Compiler()
    it('should identify fixed version', () => {
      assert.equal('0.4.24', c.solidityVersion('pragma solidity 0.4.24;'))
    })
  })
})
