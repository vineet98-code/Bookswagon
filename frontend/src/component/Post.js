import { Link } from 'react-router-dom';
import React, { useState, useContext, useEffect } from 'react';
import { BOOKS_URL } from '../utils/Constant';
import UserContext from './UserContext';

function Post(props) {

   const [favorited, setFavorited] = useState(null)
   const [favoritesCount, setFavoritesCount] = useState(0)
   const [error, setError] = useState(0)

   const { user } = useContext(UserContext);

   
   useEffect(() => {
     setFavorited(props.favorited);
     setFavoritesCount(props.favoritesCount);
     
    }, []);
    
    const handleFavorite = ((id) => {
      
      let method = favorited ? 'DELETE' : 'POST';
      
      let token = user ? 'Token ' + user.token : '';
      
      fetch(BOOKS_URL + `/${id}/favorite`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then((res) => res.json())
      .then((article) => {
        let { favorited, favoritesCount } = article.article;
        // console.log(favorited, favoritesCount);
        setFavorited(favorited);
        setFavoritesCount(favoritesCount);
      })
      .catch((error) => {
        setError(error.message);
      })
    });
    
  let { author, name, description, tagList, id, image } = props;
  if (error)
    return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>;
  return (
    <section className="mt-10 shadow p-4 rounded">
      <div className="flex justify-between">
        <div className="flex items-center">
          <img
            className="w-8 rounded-full h-8 object-cover"
            src={image}
            alt={author.name}
          />
          <div className="ml-2">
            <h4 className="text-primary neg-mb-10 font-roboto">
              <Link to={`/profile/${author.username}`}>{author.username}</Link>
            </h4>
            <time dateTime="" className="text-xs text-gray-400">
              
            </time>
          </div>
        </div>
        <div>
          {user && (
            <button
              className={`border border-primary rounded py-1 px-2 text-sm shadow ${favorited ? 'bg-primary text-white' : 'bg-white text-primary'
                }`}
              onClick={() => {
                handleFavorite(id);
              }}
            >
              <i className="fas fa-heart"></i> <span>{favoritesCount}</span>
            </button>
          )}
        </div>
      </div>
      <Link to={`/articles/${id}`}>
        <h2 className="font-medium text-2xl font-roboto">{name}</h2>
      </Link>
      <Link to={`/articles/${id}`}>
        <p className="text-gray-400 font-light">{description}</p>
      </Link>
      <div className="flex justify-between items-center">
        <Link to={`/books/${id}`}>
          <button className="text-gray-500 mt-4">Read More...</button>
        </Link>
        <ul>
          {tagList.map((tag) => (
            <li
              key={tag}
              className="text-gray-400 font-light border rounded-lg inline-block px-2 text-xs ml-1"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );

}

export default Post;