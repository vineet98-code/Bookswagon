import React, {useState} from 'react'
import Loading from './Loading'
import Post from './Post';


function Posts(props) {
  

  const { books, error } = props


if (error) {
    return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>
  }
  if (!books) {
    return <Loading />
  }
  return (
    <>
      <ul>
        {books.map(book => <Post user={props.user} key={book.id} {...book} />)}
      </ul>
    </>
  )

}

export default Posts