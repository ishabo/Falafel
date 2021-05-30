import React from 'react';
import { Grid, Button } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { getTransactionPool, mineTransaction, Transaction as TransactionType } from '../../services'
import Layout from '../Layout'
import Transaction from '../Transaction'
import useInterval from '../../hooks/useInterval'
import history from '../../history';

const POLL_INTERVAL = 10000

const Pool = ({  }) => {
  const [transactionPoolMap, setTransactionPoolMap] = React.useState<Record<string, TransactionType>>({})
  const [responseMessage, setResponseMessage] = React.useState('');
  const [mineStatus, setMineStatus] = React.useState<'idle' | 'success' | 'error' | 'warning'>('idle')


  const getTransactionPoolMap = async () => {
    const info = await getTransactionPool()
    if (info) {
      setTransactionPoolMap(info)
    }
  }

  React.useEffect(() => {
    getTransactionPoolMap()
  }, [])

  const handleMineTransaction = async () => {
      try {
        await mineTransaction();
        history.replace('/blocks')
        history.go(0)
      } catch (error) {
        setMineStatus('error')
        setResponseMessage(error.message)
      }
  }

  useInterval(getTransactionPoolMap, POLL_INTERVAL)

  return (
    <Layout title="Transaction pool">
      <Grid container spacing={3} >
        {Object.values(transactionPoolMap).map(transaction => (

          <Grid item xs={12}>
            <Transaction transaction={transaction} />
          </Grid>
        ))}
        <Grid item xs={12} >
          <Grid container direction="column" spacing={2}>
            <Grid item >
              {mineStatus === 'error' && <Alert severity='error'>{responseMessage}</Alert>}
            </Grid>
            <Grid item >
              <Button onClick={handleMineTransaction} color='secondary' variant='contained'>Mine</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Pool;
