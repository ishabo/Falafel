import React from 'react';
import {Grid } from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles';
import {getTransactionPool} from '../../services/wallet';
import {Transaction as TransactionType} from '../../services/wallet/types';
import Layout from '../Layout'
import Transaction from '../Transaction'

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: theme.spacing(2),
//     color: theme.palette.text.secondary,
//   },
// }));

const Pool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = React.useState<Record<string, TransactionType>>({});
  // const classes = useStyles()

  React.useEffect(() => {
    (async () => {
      const info = await getTransactionPool();
      if (info) {
        setTransactionPoolMap(info)
      }
    })()
  }, [])


  return (
    <Layout title="Transaction pool">
      <Grid container spacing={3} >
      {Object.values(transactionPoolMap).map(transaction => (

        <Grid item xs={12}>
          <Transaction transaction={transaction} />
        </Grid>
      ))}
      </Grid>
    </Layout>
  )
}

export default Pool;
