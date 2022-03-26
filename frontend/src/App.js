import React, { useState, useEffect } from 'react';
import { Switch, Route } from "react-router-dom";
import Header from './component/Header';
import Loader from './component/Loading';
import Home from './component/Home';
import Login from './component/Login';
import SignUp from './component/SignUp';
import NoMatch from './component/NoMatch';
import SingleBook from './component/SingleBook';
import UserContext from './component/UserContext';
import { LocalStorageKey, CURRENT_USER_URL } from './utils/Constant'
import Setting from './component/Setting';
// import Profile from './component/Profile';
import AddBook from './component/AddBook';
import Banner from './component/Banner';


function App(props) {

  const [user, setUser] = useState(null);
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [userVerifying, setUserVerifying] = useState(false);

  
  

  useEffect(() => {
    let token = localStorage.getItem(LocalStorageKey);
    console.log(token);

      fetch(CURRENT_USER_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errors) => Promise.reject(errors));
          }
          return res.json();
        })
        .then((user) => {
          setUser(user);
        })
        .catch((errors) => {
          console.log(errors);
        });
    
  }, [])

 const updateUser = (user) => {
    setUser(user);
    setIsUserLogged(true);
    setUserVerifying(true);
    localStorage.setItem(LocalStorageKey, user.token);
  };
  

   if (userVerifying) {
    <Loader />
  }

  return (
    <div>
      <UserContext.Provider
        value={{ user: user, isUserLogged: isUserLogged, updateUser: updateUser, userVerifying: userVerifying }}>

        <Header />
        
        {isUserLogged ? (
          <AuthenticatedApp />
        ) : (
          <UnAuthenticatedApp />
        )}

      </UserContext.Provider>

    </div>

  );
}

function AuthenticatedApp(props) {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/books/:id">
        <SingleBook />
      </Route>
      <Route path="/new-book">
        <AddBook />
      </Route>
      <Route path="/setting">
        <Setting />
      </Route>
      {/* <Route path="/profile/:username" >
        <Profile />
      </Route> */}
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}
function UnAuthenticatedApp(props) {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/books/:id">
        <SingleBook />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/register">
        <SignUp />
      </Route>

      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
}

export default App;