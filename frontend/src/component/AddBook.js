import React, { useContext, useState } from 'react';
import { BOOKS_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import { withRouter } from 'react-router-dom';
import UserContext from './UserContext';

function AddBook(props) {

  const [credential, setCredential] = useState({
    name: 'EAST OF EDEN',
    description: 'Steinbeck apparently considered this 1952 novel to be his magnum opus, the one which all other novels before it had merely been practice for. The title is suitably grand. ',
    tagList: 'Genesis',
    writer: 'JOHN STEINBECK',
    image: 'https://www.rd.com/wp-content/uploads/2021/01/GettyImages-1175550351.jpg',
    price: 23,
    errors: {
      name: '',
      description: '',
      tagList: '',
    },
  })

  let { user } = useContext(UserContext);

  const onImageChange = (e) => {
    setCredential([e.target.file[0]])
    console.log(e.target.value);
  }

  //  OnChange function
  const handleChange = (event) => {
    let { name, value } = event.target;
    validate(errors, name, value);
    setCredential((user) => {
      return { ...user, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(credential.image)
    const formdata = new FormData();
    formdata.append('file', credential.image, credential.image.name)
    fetchData();
  };

  const fetchData = () => {
    let { name, description, writer, tagList } = credential;

    tagList = tagList.split(',').map((tag) => tag.trim()); //send it in the form of array, to remove the extra space

    let data = { book: { name, description, writer, price, tagList } };

    fetch(BOOKS_URL, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.user.token,
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
        setCredential({ name: '', description: '', price: '', writer: '', image: '', tagList: '' });
        props.history.push('/'); // to access to the history use withRouter
      })
      .catch((errors) => {
        console.log(errors);
      });
  }

  
  let { errors, name, description, writer, price, tagList } = credential
  return (
    <section className="text-center pt-14 px-64">
      <form onSubmit={handleSubmit} className="border p-8 rounded shadow py-3">

        <h2 className="text-left text-xl">Add your Book...</h2>
        <input
          onChange={handleChange}
          type="text"
          name="name"
          className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 text-lg"
          placeholder="book name"
          value={name}
        />
        <span className="text-red-500 block">{errors.name}</span>

        
          <input type="file"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 text-lg"
            multiple accept="image/*" onChange={onImageChange} />
          <input type="submit" value="Upload" />
       

        <input
          onChange={handleChange}
          type="text"
          name="writer"
          className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4 h-10"
          placeholder="writer"
          value={writer}
        />
        <span className="text-red-500 block">{errors.writer}</span>

        <textarea
          onChange={handleChange}
          name="description"
          className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4  text-gray-400"
          rows="4"
          placeholder="Write your description (in markdown)"
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

        <input
          onChange={handleChange}
          name="price"
          type="text"
          className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 h-10"
          placeholder="Enter tags sperated by a comma"
          value={price}
        />
        <span className="text-red-500 block">{errors.price}</span>

        <div className="text-right pt-8">
          <button
            className=" bg-blue-700 px-6 rounded text-white h-10 inline-block submit hover:bg-green-700 submit"
            type="submit"
            disabled={
              errors.name ||
              errors.description ||
              errors.body ||
              errors.tagList ||
              !name ||
              !description ||
              !writer ||
              !tagList
            }
          >
            Add Book
          </button>
        </div>
      </form>
    </section>
  );

}

export default withRouter(AddBook);