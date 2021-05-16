import './App.css';
import GlobalStyled from './GlobalStyled';
import MainPage from './pages/MainPage';
function App() {
<<<<<<< HEAD
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
=======
    return (
        <>
            <GlobalStyled />
            <MainPage></MainPage>
        </>
    );
>>>>>>> 90d947ad165bf0fcf627dfa19d69d7f9a7001c61
}

export default App;
