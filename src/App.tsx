import React from 'react';
import './App.css';
import Login from './containers/Login/Login';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { useAppSelector } from './app/hooks';

import './App.css';
import { RootState } from './app/store';

function App() {

  const authenticated = useAppSelector((state: RootState) => state.session.authenticated);

  return (
    <Router>
      <div className="App">
        <Route path="/" component={Login} />
        <PrivateRoute exact path="/list" component={Login} authenticated={authenticated} />
        <PrivateRoute exact path="/character/:id" component={Login} authenticated={authenticated} />
      </div>
    </Router>
  );
}

export default App;
