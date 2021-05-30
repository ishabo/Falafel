import React from 'react';
import { Typography, TypographyProps, Grid, Paper, Button, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { Block as BlockType } from '../../services';
import Transaction from '../Transaction'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const DetailTitle: React.FC<TypographyProps> = (props) => <Typography variant='overline' display='inline' {...props} />

const Block = ({ block : { hash, data, timestamp }}: {block: BlockType}) => {
  const [showFullTransaction, toggleTransactionFullView] = React.useState(false)
  const classes = useStyles()
  const hashDisplay = `${hash.substring(0, 20)}...`
  const stringifiedData = JSON.stringify(data)
  const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData

  return (
      <Grid container spacing={3} >
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container spacing={1} >
                <Grid item xs={12}><DetailTitle>Hash</DetailTitle>: {hashDisplay}</Grid>
                <Grid item xs={12}><DetailTitle>Time:</DetailTitle> {timestamp === 1 ? 'Genesis Block' : new Date(timestamp).toLocaleString()}</Grid>
                {timestamp !== 1 && (
                  <>
                    <Grid item xs={12}>
                      <DetailTitle display='block'>Transactions:</DetailTitle>
                      {showFullTransaction ? data.map(transaction => (
                        <div key={transaction.id}>
                          <Transaction transaction={transaction}/>
                          <Divider />
                        </div>
                      )) : dataDisplay}
                    </Grid>
                    <Grid item>
                      <Button variant='contained' color='secondary' onClick={() => toggleTransactionFullView(!showFullTransaction)}>Show {showFullTransaction ? 'less' : 'more'}</Button>

                    </Grid>
                  </>
                )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
  )
}

export default Block;

