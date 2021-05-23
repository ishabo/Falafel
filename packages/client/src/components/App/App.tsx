import React from 'react';
import { Container, Box,Typography } from '@material-ui/core'

const App = () => {
  return (
    <Container>
      <Box my={4}>
        <Typography variant="h1" component="h2" >Welcome to the blockchain</Typography>
      </Box>
    </Container>
  );
}

export default App;
