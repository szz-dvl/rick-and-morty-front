import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { RootState } from './app/store';

import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Register from './containers/Register/Register';
import Login from './containers/Login/Login';
import List from './containers/List/List';
import Character from './containers/Character/Character';
import Error from './components/Error/Error';

import './App.css';

function App() {

  const authenticated = useAppSelector((state: RootState) => state.session.authenticated);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <PrivateRoute exact path="/list" component={List} authenticated={authenticated} />
          <PrivateRoute exact path="/character/:id" component={Character} authenticated={authenticated} />
          <Route path="/error" component={Error} />
          <Route component={Error} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
