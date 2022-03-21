import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import validate from '../utils/Validate';
import UserContext from './UserContext';
import { LOGIN_URL } from '../utils/Constant';
import { useHistory } from 'react-router-dom'

function Login(props) {

  const [credential, setCredential] = useState({
    email:"username@gmail.com", 
    password:"username1", 
    errors: {
    email: '',
    password: '',
    } });

  let { email, password, errors } = credential
  let history = useHistory();

  let { updateUser } = useContext(UserContext);

  const handleChange = (event) => {
    let { name, value } = event.target;
    validate(errors, name, value);
    setCredential((user) => {
      return { ...user, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Api call
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credential.email, password: credential.password })
        });
        const user = await response.json();
        // console.log(json);
        if(user){
          updateUser(user)
          setCredential(user)
            localStorage.setItem("token", user.token);
            history.push('/');
        } 
    }

  return (
    <main>
      <section className="mt-20 px-8">
        <form className="w-full md:w-1/3 mx-auto border border-gray-400 p-6 rounded-md" onSubmit={handleSubmit}>
          <div className="text-center">
            <legend className="text-2xl font-bold">Sign In</legend>
            < Link to="/register">
              <span className="text-blue-700 text-lg text-center">Need an account? </span>
            </Link>
          </div>
          <fieldset className="my-3">

            <span className="text-red-500">{errors.email}</span>
            <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Email" value={email} name="email" onChange={handleChange} />

            <span className="text-red-500">{errors.password}</span>
            <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Password" value={password} name="password" onChange={handleChange} />

            <input type="submit" disabled={errors.email || errors.password} value="Login" className="block w-full my-6 py-2 px-3 bg-blue-500 text-white font-bold cursor-pointer" />

          </fieldset>
        </form>
      </section>
    </main>
  )

}

export default withRouter(Login);