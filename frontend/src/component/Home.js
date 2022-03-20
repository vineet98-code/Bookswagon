import React, { useState, useContext, useEffect } from 'react';
import Posts from './Posts';
import Banner from './Banner';
import Tags from './Tags';
import { BOOKS_URL } from '../utils/Constant';
import UserContext from './UserContext';

export default function Home() {

  const bookDetailsInitialState = {
    books: null,
    error: null,
    booksCount: 0,
    bookPerPage: 10,
    activePageIndex: 0,
    activeNav: 'global',
    activeTag: '',
  };

  const [bookDetails, setBookDetails] = useState(bookDetailsInitialState);
  const [searchterm, setSearchterm] = useState("")

  const { bookPerPage, activePageIndex, activeTag, activeNav } = bookDetails

  let { user } = useContext(UserContext);

   const searchHandler = (searchterm) => {
     console.log(searchterm)
     
   }
  useEffect(() => {
    const limit = bookPerPage;
    const offset = activePageIndex * 10;
    const tag = activeTag;
    let feed = activeNav === 'your' ? '/feed' : '';
    let token = user ? 'Token ' + user.token : '';


    fetch(BOOKS_URL + `/${feed}/?limit=${limit}&offset=${offset}` + (tag && `&tag=${tag}`),
      {
        method: 'GET',
        headers: {
          'Conten-Type': 'application/json',
          Authorization: token,
        }
      })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) =>
        setBookDetails((bookDetails) => {
          return {
            ...bookDetails,
            books: data.books,
            booksCount: data.booksCount,
          }
        })
      )
      .catch((error) =>
        setBookDetails((bookDetails) => {
          return {
            ...bookDetails,
            error: 'Not able to fetch books!',
          };
        })
      );
  }, [activePageIndex,bookPerPage, user, activeTag, activeNav]);


  const addTagTab = (tag) => {
    setBookDetails((bookDetails) => {
      return {
        ...bookDetails,
        activeTag: tag,
        activeNav: '',
        activePageIndex: 0,
      };
    });
  };

  
  return (
    <main>
      <Banner />
      <div className="px-40">
        <div className="flex">
          <div className="w-3/12 ml-12 mt-9">
            <Tags addTagTab={addTagTab} activeNav={activeNav} />
          </div>
          <div className="w-8/12">
            <Posts {...bookDetails} 
                  searchterm={searchterm}
                  searchkeywords={searchHandler}
                /></div>
        </div>
       
      </div>
    </main>
  );

}