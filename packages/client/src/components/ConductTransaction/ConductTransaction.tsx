import React from 'react';
import { Grid, Button, FormControl, Input, InputLabel } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles'
import { transact } from '../../services/wallet'
import Layout from '../Layout'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

const ConductTransaction = () => {
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [responseMessage, setResponseMessage] = React.useState('');
  const [transactionStatus, setTransactionStatus] = React.useState<'idle' | 'success' | 'error' | 'warning'>('idle')
  const classes = useStyles();


  const handleRecipientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipient(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  };


  const handleSubmit = async () => {
    if (recipient && amount > 0) {
      try {
        const response = await transact({ recipient, amount });
        if (response.type !== 'success') {
          throw new Error(response.message)
        } else {
          setTransactionStatus('success')
          setResponseMessage(`You have successfully sent ${amount} to ${recipient}`)
          setAmount(0)
          setRecipient('')
        }
      } catch (error) {
        setTransactionStatus('error')
        setResponseMessage(error.message)
      }
    } else {
      setTransactionStatus('warning')
      setResponseMessage('Please provide a recipient address and an amount')
    } 
  }


  return (
    <Layout title="Send Humus">
      {transactionStatus !== 'idle' && <Alert severity={transactionStatus}>{responseMessage}</Alert>}
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container direction="column" spacing={3}>
          <Grid item xs={6}>
            <FormControl>
              <InputLabel htmlFor="amount">Amount</InputLabel>
              <Input id="amount" placeholder='amount' value={amount} onChange={handleAmountChange}  />
            </FormControl>
          </Grid>
          <Grid item xs={10}>
            <FormControl fullWidth>
              <InputLabel htmlFor="recipient">Recipient</InputLabel>
              <Input id="recipient" fullWidth placeholder='recipient' value={recipient} onChange={handleRecipientChange} />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl>
              <Button color="primary" variant="contained" onClick={handleSubmit}>Send</Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Layout>
  )
}

export default ConductTransaction
