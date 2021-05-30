import React from 'react';
import { createBrowserHistory } from "history";
import { Router, Switch, Route } from 'react-router-dom'
import Home from '../Home'
import Blocks from '../Blocks'
import ConductTransaction from '../ConductTransaction'

const customHistory = createBrowserHistory() as any;

const Routes = () => (
  <Router history={customHistory}>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/send" component={ConductTransaction} />
    </Switch>
  </Router>
)

export default Routes;
