import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import UserContext from './UserContext';


export default function Header(props) {

  let {isUserLogged} = useContext(UserContext);

  return (
    <header className="bg-red-500 px-40 flex justify-between items-center">
      <button className="text-primary font-bold text-2xl py-3">
        <Link to="/">Bookwagons</Link>
      </button>
      {isUserLogged ? (
        <AuthHeader />
      ) : (
        <NonAuthHeader />
      )}
    </header>
  );
}

function NonAuthHeader() {
  return (
    <div>
      <button className="text-primary ml-6">
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </button>
      <button className="text-primary ml-6">
        <NavLink activeClassName="active" to="/login">
          Sign In
        </NavLink>
      </button>
      <button className="text-primary ml-6">
        <NavLink activeClassName="active" to="/register">
          Sign Up
        </NavLink>
      </button>
    </div>
  );
}

function AuthHeader(props) {
  let {user} = useContext(UserContext);
  return (
    <div className="font-roboto">
      <button className="text-primary ml-6">
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </button>
      <button className="text-primary ml-6">
        <NavLink activeClassName="active" to="/new-book">
          <i className="fas fa-edit"></i>Add Books
        </NavLink>
      </button>
      <button className="text-primary ml-6">
        <NavLink activeClassName="active" to="/setting">
          <i className="fas fa-cog"></i> Setting
        </NavLink>
      </button>
      <button className="text-primary ml-6">
        <NavLink
          activeClassName="active"
          to={`/profile/${user.username}`}
        >
          <i className="fas fa-user"></i> {user.username}
        </NavLink>
      </button>
    </div>
  );
}