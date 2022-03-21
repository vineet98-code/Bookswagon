import React, { Component } from 'react';
import { BOOKS_URL } from '../utils/Constant';
import validate from '../utils/Validate';
import { withRouter } from 'react-router-dom';
import UserContext from './UserContext';

class AddBook extends Component {
  state = {
    name: '',
    description: '',
    tagList: '',
    images: [],
    imageURLs: [],
    author: '',
    errors: {
      name: '',
      description: '',
      tagList: '',
    },
  };
  static contextType = UserContext;
  
  onImageChange = (e) => {
     this.setState([...e.target.value])
   }


 //  OnChange function
  handleChange = (event) => {
    event.preventDefault();
    let { name, value } = event.target;
    let errors = this.state.errors;
    validate(errors, name, value);
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.fetchData();
  };

  fetchData() {
    let { name, description,author, tagList } = this.state;

    tagList = tagList.split(',').map((tag) => tag.trim()); //send it in the form of array, to remove the extra space

    let data = { book: { name, description, author,  tagList } };

    fetch(BOOKS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.user.token,
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
        this.setState({ name: '', description: '', author: '', image:'', tagList: '' });
        this.props.history.push('/'); // to access to the history use withRouter
      })
      .catch((errors) => {
        console.log(errors);
      });
  }


  render() {

    let { errors, name, description, author, tagList } = this.state;

    return (
      <section className="text-center pt-14 px-64">
        <form onSubmit={this.handleSubmit} className="border p-8 rounded shadow py-3">

          <h2 className="text-left text-xl">Add your Book...</h2>
          <input
            onChange={this.handleChange}
            type="text"
            name="name"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 text-lg"
            placeholder="book name"
            value={name}
          />
          <span className="text-red-500 block">{errors.name}</span>

          {/* <input type="file" multiple accept="image/*" onChange={this.onImageChange} />
          { this.imageURLs.map(imageSrc => <img src={imageSrc} alt={imageSrc}/> )} */}
          <input
            onChange={this.handleChange}
            type="text"
            name="author"
            className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4 h-10"
            placeholder="author"
            value={author}
          />
          <span className="text-red-500 block">{errors.description}</span>
          <textarea
            onChange={this.handleChange}
            name="description"
            className="block w-full border rounded-lg border-gray-300 px-2 py-3 mx-auto mt-4  text-gray-400"
            rows="4"
            placeholder="Write your description (in markdown)"
            value={description}
          ></textarea>
          <span className="text-red-500 block">{errors.book}</span>
          <input
            onChange={this.handleChange}
            name="tagList"
            type="text"
            className="block w-full border rounded-lg border-gray-300 px-2  py-3 mx-auto mt-4 h-10"
            placeholder="Enter tags sperated by a comma"
            value={tagList}
          />
          <span className="text-red-500 block">{errors.tagList}</span>
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
                !author ||
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
}

export default withRouter(AddBook);