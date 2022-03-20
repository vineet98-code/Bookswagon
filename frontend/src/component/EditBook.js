import React, { useContext, useState, useEffect } from 'react';
import { BOOKS_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import { withRouter } from 'react-router-dom';
import Loader from './Loading';
import UserContext from './UserContext';

const EditBook = (props) => {
  const EditBookIntialState = {
    name: '',
    description: '',
    author: '',
    price: '',
    available: '',
    image: '',
    tagList: '',
    errors: {
      name: '',
      description: '',
      author: '',
      price: '',
      available: '',
      tagList: '',
    },
  };
  const [book, setBook] = useState(EditBookIntialState);
  const [error, setError] = useState(null);

  const [isDataFetched, setIsDataFetched] = useState(false);
  let { name, author, price, description, tagList, errors } = book;
  let { user } = useContext(UserContext);
  let id = props.match.params.id;

  useEffect(() => {
    fetch(BOOKS_URL + '/' + id)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => {
        let { name, author, price, description, tagList } = data.book;
        tagList = tagList.join();
        setBook({
          ...book,
          name,
          price,
          description,
          tagList,
          author
        });
        setIsDataFetched(true);
      })
      .catch((error) => {
        setError('Unable to fetch book!');
      });
  },[]);

  const handleChange = (event) => {
    let { name, value } = event.target;
    validate(errors, name, value);
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchbook();
  };

  const fetchbook = () => {
    let id = props.match.params.id;
    
    tagList = tagList.split(',').map((ele) => ele.trim());
    let data = {
      book: {
        name,
        description,
        tagList,
        price,
        author
      },
    };

    fetch(BOOKS_URL + '/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + user.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => Promise.reject(error));
        }
        return res.json();
      })
      .then((book) => {
        setBook(EditBookIntialState);
        props.history.push(`/books/${props.match.params.id}`)
      })
      .catch((error) => {
        setError('Unable to fetch book!');
      });
  };

  if (error)
  return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>;

  if (!isDataFetched) return <Loader />;

  return (
    <section className="text-center pt-14 px-64">
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 text-lg"
          placeholder="book Name"
          value={name}
        />
        <span className="text-red-500 block">{errors.name}</span>
        <input
          onChange={handleChange}
          type="text"
          name="price"
          className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4 h-10"
          placeholder="price"
          value={price}
        />
        <span className="text-red-500 block">{errors.price}</span>
        <textarea
          onChange={handleChange}
          name="description"
          className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4  text-gray-400"
          rows="6"
          placeholder="Write your description"
          value={description}
        ></textarea>
        <span className="text-red-500 block">{errors.description}</span>
        <input
          onChange={handleChange}
          name="tagList"
          type="text"
          className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 h-10"
          placeholder="Enter tags sperated by a comma"
          value={tagList}
        />
        <span className="text-red-500 block">{errors.tagList}</span>
        <div className="text-right pt-8">
          <button
            className="bg-primary px-6 rounded text-white h-10 inline-block submit hover:bg-green-700 submit"
            type="submit"
            disabled={
              errors.name ||
              errors.description ||
              errors.price ||
              errors.tagList
            }
          >
            Update book
          </button>
        </div>
      </form>
    </section>
  );
}

export default withRouter(EditBook);