import React from 'react';
import { Typography, Grid } from '@material-ui/core'
import { getWalletInfo } from '../../services/wallet';
import { toCurrency } from '../../utils'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  address: {
    wordBreak: 'break-word',
  },
}))

interface WalletInfo {
  address: string
  balance: number
}


const DisplayWalletInfo = ({ walletInfo }: {walletInfo: WalletInfo}) => {
  const classes = useStyles();
  return(
    <Grid container >
      <Grid item>
        <Typography variant="h5" component="h6" >Balance: {toCurrency(walletInfo.balance)}</Typography>
      </Grid>
      <Grid item>
        <div className={classes.address}>
          <Typography variant="overline" display="block" gutterBottom>Address: {walletInfo.address}</Typography>
        </div>
      </Grid>
    </Grid>
  )
}

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

      <Grid item>

        {walletInfo && <DisplayWalletInfo walletInfo={walletInfo}/>}
      </Grid>
    </Grid>
  );
}

export default Wallet;

