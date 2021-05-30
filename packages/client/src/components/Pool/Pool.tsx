import React from 'react';
import {Grid } from '@material-ui/core'
import { getTransactionPool, Transaction as TransactionType } from '../../services'
import Layout from '../Layout'
import Transaction from '../Transaction'
import useInterval from '../../hooks/useInterval'

const POLL_INTERVAL = 10000

const Pool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = React.useState<Record<string, TransactionType>>({})


  const getTransactionPoolMap = async () => {
    const info = await getTransactionPool()
    if (info) {
      setTransactionPoolMap(info)
    }
  }

  React.useEffect(() => {
    getTransactionPoolMap()
  }, [])

  useInterval(getTransactionPoolMap, POLL_INTERVAL)

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
