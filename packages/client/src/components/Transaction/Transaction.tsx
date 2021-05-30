import React from 'react';
import {  Box, Grid } from '@material-ui/core'
import { toCurrency } from '../../utils'
import { Transaction as TransactionType } from '../../services';

const Transaction = ({ transaction }: {transaction: TransactionType}) => {

  const { input, outputMap } = transaction
  const recipients = Object.keys(outputMap)

  return (
    <Box component="span" m={1}>

      <Grid container>
        <Grid item xs={12}>From: {`${input.address.substring(0, 32)}...`} | Balance: {toCurrency(input.amount)}</Grid>

        <Grid item xs={12}>
            {recipients.map(recipient => (
              <div key={recipient}>
              &nbsp;&nbsp;&nbsp;|__ To: {`${recipient.substring(0, 32)}...`} | Sent: {toCurrency(outputMap[recipient])}
              </div>
            ))}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Transaction;

