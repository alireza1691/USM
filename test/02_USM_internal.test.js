const { BN, expectRevert } = require('@openzeppelin/test-helpers')

const TestOracle = artifacts.require('TestOracle')
const USM = artifacts.require('USM')
const USMView = artifacts.require('USMView')

const EVM_REVERT = 'VM Exception while processing transaction: revert'

require('chai').use(require('chai-as-promised')).should()

contract('USM - Internal functions', (accounts) => {
  const [deployer, user1, user2, user3] = accounts
  let usm, usmView

  const ZERO = new BN('0')
  const WAD = new BN('1000000000000000000')
  const price = new BN('250')
  const priceWAD = price.mul(WAD)

  beforeEach(async () => {
    oracle = await TestOracle.new(priceWAD, { from: deployer })
    usm = await USM.new(oracle.address, [], { from: deployer })
    usmView = await USMView.new(usm.address, { from: deployer })
  })

  describe('functionality', async () => {
    it('returns the oracle price in WAD', async () => {
      const oraclePrice = (await usm.latestPrice())[0]
      oraclePrice.toString().should.equal(priceWAD.toString())
    })

    it('returns the value of eth in usm', async () => {
      const oneEth = WAD
      const equivalentUSM = oneEth.mul(priceWAD).div(WAD)
      const usmAmount = await usmView.ethToUsm(oneEth, false)
      usmAmount.toString().should.equal(equivalentUSM.toString())
    })

    it('returns the value of usm in eth', async () => {
      const oneUsm = WAD
      const equivalentEth = oneUsm.mul(WAD).div(priceWAD)
      const ethAmount = await usmView.usmToEth(oneUsm, false)
      ethAmount.toString().should.equal(equivalentEth.toString())
    })

    it('returns the debt ratio as zero', async () => {
      const ZERO = new BN('0')
      const debtRatio = (await usmView.debtRatio())
      debtRatio.toString().should.equal(ZERO.toString())
    })
  })
})
