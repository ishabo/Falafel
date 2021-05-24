import Blockchain from '@falafel/blockchain'
import Wallet, { TransactionPool } from '@falafel/wallet'
import TransactionMiner from './transaction-miner'

const isDevelopment = process.env.NODE_ENV === 'development';

const seedData = ({
  blockchain,
  transactionPool,
  mainWallet,
  transactionMiner,
}: {
  blockchain: Blockchain
  transactionPool: TransactionPool
  mainWallet: Wallet
  transactionMiner: TransactionMiner,
}) => {
if (isDevelopment) {
  const walletFoo = new Wallet();
  const walletBar = new Wallet();

  const generateWalletTransaction = ({ wallet, recipient, amount }: { wallet: Wallet, recipient: string, amount: number}) => {
    const transaction = wallet.createTransaction({
      recipient, amount, chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
  };

  const walletAction = () => generateWalletTransaction({
    wallet: mainWallet, recipient: walletFoo.publicKey, amount: 5
  });

  const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
  });

  const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: mainWallet.publicKey, amount: 15
  });

  for (let i=0; i<20; i++) {
    if (i%3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i%3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    transactionMiner.mineTransactions();
  }
}

}
export default seedData
