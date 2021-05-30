import React from 'react';
import { Grid, AppBar, Link, Toolbar, Typography, InputBase, Divider  } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  header: {
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
    },
  },
  links: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    width: '50%',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.common.white,
    },
    width: '100%',
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

const Header = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar color='transparent' elevation={0} className={classes.header} position="static">
        <Toolbar>
          <Grid container direction="row"  alignItems="center">
            <Grid item xs={1} sm={6}>
              <Typography className={classes.title} variant="h6" noWrap>
                Falafel
              </Typography>
            </Grid>
            <Grid item xs={10} sm={6}>
              <Grid container direction="row" justify="flex-end" alignItems="center">
                <Grid item>
                  <div className={classes.links}>
                    <Link href="/" color="inherit">
                      Home
                    </Link>
                    <Link href="/blocks" color="inherit">
                      Blocks
                    </Link>
                    <Link href="/send" color="inherit">
                      Send
                    </Link>
                    <Link href="/pool" color="inherit">
                      Pool
                    </Link>
                    <Divider orientation="vertical" flexItem />
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase
                      placeholder="Search…"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{ 'aria-label': 'search' }}
                    />
                  </div>
              </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default Header
