import React from 'react';
import {  Typography, Grid } from '@material-ui/core'
import {getWalletInfo} from '../../services/wallet';

interface WalletInfo {
  address: string
  balance: number
}

const DisplayWalletInfo = ({ walletInfo }: {walletInfo: WalletInfo}) => (
    <div>
      Address: {walletInfo.address}
      <br />
      Balance: {walletInfo.balance}
    </div>
)

const Wallet = () => {
  const [walletInfo, setWalletInfo] = React.useState<undefined | WalletInfo>(undefined);

  React.useEffect(() => {
    (async () => {
      const info = await getWalletInfo();
      if (info) {
        setWalletInfo(info)
      }
    })()
  }, [])

  return (
    <Grid container>
      <Grid item><Typography variant="h2" component="h4">Wallet</Typography></Grid>

      <Grid item>

        {walletInfo && <DisplayWalletInfo walletInfo={walletInfo}/>}
      </Grid>
    </Grid>
  );
}

export default Wallet;

