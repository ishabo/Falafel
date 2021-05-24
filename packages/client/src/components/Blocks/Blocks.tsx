import React from 'react';
import { Typography, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { getBlocks } from '../../services/blocks';
import { Block } from '../../services/blocks/types';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

const DisplayBlock = ({ block : { hash, lastHash, timestamp }}: {block: Block}) => {
  const classes = useStyles();
  return (
      <Grid container spacing={3}>
        <Grid item>
          <Paper className={classes.paper}>
              <div>Time: {timestamp === 1 ? 'Genesis Block' : new Date(timestamp).toLocaleString()}</div>
              <div>Hash: {hash}</div>
              <div>Last Hash: {lastHash}</div>
          </Paper>
        </Grid>
        </Grid>
  )
}

const Blocks = () => {
  const [blocks, setBlocks] = React.useState<undefined | Array<Block>>(undefined);

  React.useEffect(() => {
    (async () => {
      const info = await getBlocks();
      if (info) {
        setBlocks(info)
      }
    })()
  }, [])

  return (
    <Grid container spacing={1}>
      <Grid item><Typography variant="h1" component="h4"></Typography></Grid>
      <Grid item xs={12}>
          <Typography variant="h2" component="h4">Blocks</Typography>
          {blocks && blocks.map(block => (<DisplayBlock key={block.hash} block={block}/>))}
      </Grid>
    </Grid>
  );
}

export default Blocks;

