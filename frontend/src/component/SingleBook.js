import React, { useContext, useState, useEffect } from 'react';
import { BOOKS_URL } from '../utils/Constant';
import Loader from './Loading';
import { Link, withRouter } from 'react-router-dom'; // withRouter is used to access the history object
import UserContext from './UserContext';


const SingleBook = (props) =>{

const [book, setBook] = useState(null);
const [error, setError] = useState('')

let { user, isUserLogged } = useContext(UserContext);

useEffect(() =>  {
   let id = props.match.params.id;
  

    fetch(`localhost:4000/api/books/${id}` )
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => {
        setBook(data.book);
      })
      .catch((error) => {
        setError('Unable to fetch book!' );
      });
  }, []);

  const handleDelete = (id) => {

    fetch(BOOKS_URL + `/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
    })
    .then((res) => {
        if (!res.ok) {
          return Promise.reject('Unable to delete!');
        }
    })
    .then(() => {
        props.history.push('/');
    })
    .catch((error) => setError( error ));
  };

  if (error)
      return (
     <p className="text-red-500 mt-8 text-lg text-center">{error}</p>
  );

    if (!book) return <Loader />;
    let { author, name, description,image, tagList, id } = book;

    return (
      <section className="px-40">
        <div className="bg-secondary py-8 pl-40 shadow">
          <h1 className="text-5xl mb-8">{name}</h1>

          <div className="flex justify-between items-center">
            <img className="w-50  h-40 object-cover" src={image} alt={image.name} />
          
            {user 
            ? (
              <div>
                <button
                  className="border border-red-400 rounded ml-2 px-3 text-sm py-1 text-red-400 hover:bg-red-400 hover:text-white"
                  onClick={() => {
                    handleDelete(id);
                  }}
                >
                  <i className="fas fa-trash-alt"></i> Delete book
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
          <p className="py-10 text-lg text-gray-600">{description}</p>
          <p className="py-7 text-gray-600">{tagList}</p>
        </div>
        
        {/* if user not logged in, then display sign in and sign out otherwise don't display */}
        {!isUserLogged ? (
          <h4 className="text-center mt-8 py-5">
            <Link className="text-primary text-lg  text-blue-600 visited:text-purple-600 ..." to="/login">
              Sign in
            </Link>{' '}
            to add book and delete book
          </h4>
        ) : (
          ''
        )}
      </section>
    );
  
}

// withRouter is used to access the history object
export default withRouter(SingleBook);