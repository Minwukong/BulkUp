import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" component={MainPage} exact />
                <Route path="/login" component={LoginPage} exact />
            </Switch>
        </Router>
    );
}

export default App;
