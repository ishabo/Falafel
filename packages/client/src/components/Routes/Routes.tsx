import React from 'react';
import { BrowserRouter, Router, Switch, Route } from 'react-router-dom'
import Home from '../Home'
import Blocks from '../Blocks'
import Transact from '../Transact'
import Pool from '../Pool'
import history from '../../history';


const Routes = () => (
  <BrowserRouter forceRefresh>
    <Router history={history as any}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/blocks" component={Blocks} />
        <Route path="/send" component={Transact} />
        <Route path="/pool" component={Pool} />
      </Switch>
    </Router>
  </BrowserRouter>
)

export default Routes;
