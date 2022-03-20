import { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { CURRENT_USER_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import UserContext from './UserContext';

const Setting = (props) => {

  const initialProfileState = {
    image: '',
    username: '',
    bio: '',
    email: '',
    password: '',
    errors: {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: '',
    },
  };
  
  const [profile, setProfile] = useState(initialProfileState);

  let { user, updateUser } = useContext(UserContext);

  let { image, username, bio, email, password, errors } = profile;
  
  useEffect(() => {
    let { username, email, image, bio } = user;
    setProfile((profile) => {
      return {
        ...profile,
        username,
        email,
        image,
        bio,
      };
    });
  }, [user])
  
  const handleChange = (event) => {
    let { name, value } = event.target;
    validate(errors, name, value);
    setProfile((profile) => {
       return { 
        ...profile, 
        [name]: value,
       };
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    props.history.push('/');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let body = {
      user: {
        email,
        bio,
        image,
        username,
      },
    };

    if (password) body.user.password = password;

    fetch(CURRENT_USER_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errors) => Promise.reject(errors));
        }
        return res.json();
      })
      .then((user) => {
        updateUser(user.user);
        props.history.push('/');
      })
      .catch((errors) => {
        setProfile((profile) => {
          return {
            ...profile,
            errors: errors.errors,
          };
        });
      });
  };
  return (
    <section className="pt-8 px-64">
        <form onSubmit={handleSubmit} className="border p-4 px-8 rounded shadow">
        <h2 className="text-center text-2xl mt-4">Your Setting</h2>
          <input
            onChange={handleChange}
            type="text"
            name="image"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 h-10"
            placeholder="URL of profile picture"
            value={image}
          />
          <input
            onChange={handleChange}
            name="username"
            type="text"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4"
            value={username}
          />
          <span className="text-red-500 block text-center">
            {errors.username}
          </span>
          <textarea
            onChange={handleChange}
            name="bio"
            className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4  text-gray-400"
            rows="6"
            placeholder={bio}
            value={bio}
          ></textarea>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4"
            placeholder="Email"
            value={email}
          />
          <span className="text-red-500 block text-center">{errors.email}</span>
          <input
            onChange={handleChange}
            name="password"
            type="password"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4"
            placeholder="New Password"
            value={password}
          />
          <span className="text-red-500 block text-center">
            {errors.password}
          </span>
          <div className="w-full mx-auto text-right pt-8">
            <button
              className="bg-green-700 px-6 py-3 rounded text-white inline-block submit"
              type="submit"
              disabled={errors.email || errors.password}
            >
              Update Setting
            </button>
          </div>
        </form>
        <div className="w-full mx-auto text-left pt-8">
            <button
              className="border border-red-500 px-6 rounded text-red-500 inline-block submit h-10 hover:bg-red-500 hover:text-white"
              onClick={handleLogout}
            >
              Click here to logout.
            </button>
          </div>
      </section>
    );
  
}

export default withRouter(Setting);