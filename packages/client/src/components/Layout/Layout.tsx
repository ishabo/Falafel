import React from 'react';
import { Typography, Container, Box , Paper} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Header from '../Header'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
    position: 'relative',
  },
  main: {
    top: -64,
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)'
  },

  section: {
    marginTop: 64,
    backgroundColor: theme.palette.primary.main,
    width: '100%',
    height: 250
  },
  heading: {
    color: theme.palette.common.white
  },
  body: {
    padding: theme.spacing(2)
  }
}))

const Layout: React.FC<{title: string}> = ({children, title}) => {
  const classes = useStyles();
  return (
    <Container className={classes.root}  maxWidth={false}>
      <Box className={classes.section}  height="292px" />
      <Container className={classes.main} maxWidth='lg'>
        <Header />
        <Box className={classes.heading} m={4}>
          <Typography variant="h2" component="h5">{title}</Typography>
        </Box>
        <Paper className={classes.body}>
          {children}
        </Paper>
      </Container>
    </Container>
  );
}

export default Layout;
