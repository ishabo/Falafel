import React from 'react';
import { Container, Box,Typography, Divider } from '@material-ui/core'
import Wallet from '../Wallet'
import Blocks from '../Blocks'

const App = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h1" component="h3" >Welcome to the blockchain</Typography>
        <Wallet />
        <Divider />
        <Blocks />
      </Box>
    </Container>
  );
}

export default App;
