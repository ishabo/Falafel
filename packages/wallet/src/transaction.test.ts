import Util, {Signature} from '@falafel/util'
import { MINING_REWARD, REWARD_INPUT } from '@falafel/constants'
import Transaction from './transaction'
import Wallet from '.'

describe('Transaction', () => {
  let transaction: Transaction
  let senderWallet: Wallet
  let recipient: string
  let amount: number

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = 'recipient-public-key';
    amount = 50;
    transaction = new Transaction({ senderWallet, recipient, amount });  
  })

  it('has an id', () => {
    expect(transaction).toHaveProperty('id')
  })

  describe('outputMap', () => {
    it('has an `outputMap`', () => {
      expect(transaction).toHaveProperty('outputMap')
    })
  })

  describe('input', () => {
    it('has an `input`', () => {
      expect(transaction).toHaveProperty('input')
    })

    it('has a `timestamp` in the input', () => {
      expect(transaction.input).toHaveProperty('timestamp')
    })

    it('has a `amount` to the `senderWallet` balance', () => {
      expect(transaction.input.amount).toStrictEqual(senderWallet.balance)
    })

    it('sets a `address` to the `senderWallet` publicKey', () => {
      expect(transaction.input.address).toStrictEqual(senderWallet.publicKey)
    })

    it('signs the input', () => {
      expect(
        Util.verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true)
    })
  })

  describe('validTransaction()', () => {
    let errorMock: jest.Mock

    beforeEach(() => {
      errorMock = jest.fn()

      global.console.error = errorMock
    })

    describe('when transaction is valid', () => {
      it('returns true', () => {
        expect(Transaction.validTransaction(transaction)).toBe(true)
      })
    })

    describe('when transaction is invalid', () => {
      describe('and a transaction outputMap value is invalid', () => {
        it('returns false', () => {
          transaction.outputMap[senderWallet.publicKey] = 999999

          expect(Transaction.validTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalledTimes(1)
        })
      })

      describe('and a transaction input signature is invalid', () => {
        it('returns false', () => {
          transaction.input.signature = new Wallet().sign('data')

          expect(Transaction.validTransaction(transaction)).toBe(false)
          expect(errorMock).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

    describe('update()', () => {
    let originalSignature: Signature
    let originalSenderOutput: number
    let nextRecipient: string
    let nextAmount: number

    describe('and the amount is invalid', () => {
      it('throws an error', () => {
        expect(() => {
          transaction.update({
            senderWallet, recipient: 'foo', amount: 999999
          })
        }).toThrow('Amount exceeds balance');
      });
    });

    describe('and the amount is valid', () => {
      beforeEach(() => {
        originalSignature = transaction.input.signature;
        originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
        nextRecipient = 'next-recipient';
        nextAmount = 50;
  
        transaction.update({
          senderWallet, recipient: nextRecipient, amount: nextAmount
        });
      });
  
      it('outputs the amount to the next recipient', () => {
        expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
      });
  
      it('subtracts the amount from the original sender output amount', () => {
        expect(transaction.outputMap[senderWallet.publicKey])
          .toEqual(originalSenderOutput - nextAmount);
      });
  
      it('maintains a total output that matches the input amount', () => {
        expect(
          Object.values(transaction.outputMap)
            .reduce((total, outputAmount) => total + outputAmount)
        ).toEqual(transaction.input.amount);
      });
  
      it('re-signs the transaction', () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
      });

      describe('and another update for the same recipient', () => {
        let addedAmount: number;

        beforeEach(() => {
          addedAmount = 80;
          transaction.update({
            senderWallet, recipient: nextRecipient, amount: addedAmount
          });
        });

        it('adds to the recipient amount', () => {
          expect(transaction.outputMap[nextRecipient])
            .toEqual(nextAmount + addedAmount);
        });

        it('subtracts the amount from the original sender output amount', () => {
          expect(transaction.outputMap[senderWallet.publicKey])
            .toEqual(originalSenderOutput - nextAmount - addedAmount);
        });
      });
    });
  });

  describe('rewardTransaction()', () => {
    let rewardTransaction: Transaction
    let minerWallet: Wallet

    beforeEach(() => {
      minerWallet = new Wallet();
      rewardTransaction = Transaction.rewardTransaction({ minerWallet });
    });

    it('creates a transaction with the reward input', () => {
      expect(rewardTransaction.input).toEqual(REWARD_INPUT);
    });

    it('creates one transaction for the miner with the `MINING_REWARD`', () => {
      expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(MINING_REWARD);
    });
  });
})
