import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import validate from '../utils/Validate';
import { SIGNUp_URL } from '../utils/Constant';
import UserContext from './UserContext';
import { useHistory } from 'react-router-dom'

function SignUp(props) {

  const [credential, setCredential] = useState({ username: 'manu', email: "manu@gmail.com", password: "manu1",
    errors: {
      username:'',
      email: '',
      password: '',
    }
  });

  let history = useHistory();

  let { username, email, password, errors } = credential

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
        const response = await fetch(SIGNUp_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: credential.username, email: credential.email, password: credential.password })
        })
        
        const json = await response.json();
        // console.log(json);
        if(json){
          updateUser(json)
          setCredential(json)
            localStorage.setItem("token", json.token);
            history.push('/');
        } 
        
    }

  return (
    <main>
      <section className="mt-20 px-8">
        <form className="w-full md:w-1/3 mx-auto border border-gray-400 p-6 rounded-md" onSubmit={handleSubmit}>
          <div className="text-center">
            <legend className="text-2xl font-bold">Sign up</legend>
            < Link to="/login">
              <span className="text-blue-700 text-lg text-center">SignIn</span>
            </Link>
          </div>
          <fieldset className="my-3">

            <span className="text-red-500">{errors.username}</span>
            <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Username" value={username} name="username" onChange={handleChange} />

            <span className="text-red-500">{errors.email}</span>
            <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Email" value={email} name="email" onChange={handleChange} />

            <span className="text-red-500">{errors.password}</span>
            <input className="block w-full my-3 py-2 px-3 border border-gray-400 rounded-md" type="text" placeholder="Enter Password" value={password} name="password" onChange={handleChange} />

            <input type="submit" disabled={errors.email || errors.password || errors.username} value="SignUp" className="block w-full my-6 py-2 px-3 bg-blue-500 text-white font-bold cursor-pointer" />

          </fieldset>
        </form>
      </section>
    </main>
  )
}


export default withRouter(SignUp);