import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import UserContext from './UserContext';

function Post(props) {
  const [error, setError] = useState(0)

  const { user } = useContext(UserContext);

  let { author, name, description, tagList, id, image } = props;
  if (error)
    return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>;
  return (
    <section className="mt-10 shadow p-4 rounded">
      <div className="flex justify-between">
        <img className="w-50  h-40 object-cover" src={image} alt={image} />

        <div>
          <Link to={`/books/${id}`}>
            <h2 className="font-medium text-2xl font-roboto">{name}</h2>
          </Link>
          <Link to={`/books/${id}`}>
            <p className="text-gray-400 font-light">{description}</p>
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
      </div>
    </section>
  );

}

export default Post;