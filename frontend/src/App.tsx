import React from 'react';
import './App.css';
import MainPage from './pages/MainPage';
function App() {
    const isLogin = false;
    <div>
      <Header />
      {isLogin ? (
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route path="/mypage" component={MyPage} />
          <Route path="/404" component={NotFound} />
          <Redirect from="*" to="/404" />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/" component={Login} />}
          <Route path="/signup" component={SignUp} />
          <Route path="/404" component={NotFound} />
          <Redirect from="*" to="/404" />
        </Switch>
      )}
    </div>
}

export default App;
