import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage';
import NavBar from './components/views/NavBar/NavBar';
import Footer from './components/views/Footer/Footer';
import Register from './components/views/RegisterPage/RegisterPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Auth from './hoc/auth';
function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        {/* hoc(higher order component)를 적용하기 위해 해당 component(ex. LandingPage)를 auth로 감싼다 
            감싸 줄때 추가적인 옵션 필요!
            hoc/auth.js의 파라미터 형태 참고
        */}
        <Switch>
          <Route exact path="/" component={ Auth(LandingPage, null ) }  />
          <Route exact path="/login" component={ Auth(LoginPage, false )}  />
          <Route exact path="/register" component={ Auth(RegisterPage, false ) } />
        </Switch>
      </div>
    </Router>
  );
}

export default App;