import React, { useState, useContext, useEffect } from 'react';
import Posts from './Posts';
import Banner from './Banner';
import Tags from './Tags';
import FeedNav from './FeedNav';
import { BOOKS_URL } from '../utils/Constant';
import UserContext from './UserContext';

const bookDetailsInitialState = {
  books: null,
  error: null,
  booksCount: 0,
  bookPerPage: 10,
  activePageIndex: 0,
  activeNav: 'global',
  activeTag: '',
};

export default function Home() {
  
  const [searchQuery, setSearchQuery] = useState('')


  const [bookDetails, setBookDetails] = useState(bookDetailsInitialState);


  const { books, booksCount, bookPerPage, activePageIndex, activeTag, activeNav } = bookDetails

  let { user } = useContext(UserContext);

  const getBook = () => {
    if(searchQuery.length > 2){
      
      return books.filter((book) => {
        const bookName = book.name.toLowerCase();
        return bookName.includes(searchQuery)
      })
      
    }
    return books;
  }
   

  useEffect(() => {
    const tag = activeTag;
    const limit = bookPerPage;
    const offset = activePageIndex * 10;
    let token = user ? 'Token ' + user.token : '';
    let feed = activeNav === 'your' ? '/feed' : '';

    fetch(BOOKS_URL + `/${feed}?limit=${limit}&offset=${offset}` + (tag && `&tag=${tag}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

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
  }, [activePageIndex, bookPerPage, user, activeTag, activeNav]);

  const handleNavigation = (tab) => {
    setBookDetails((bookDetails) => {
      return {
        ...bookDetails,
        activeTag: '',
        activeNav: tab,
        activePageIndex: 0,
      };
    });
  };

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
      <Banner setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
      <div className="px-40">
        <div className="flex">
          <div className="w-3/12 ml-12 mt-9">
            <Tags addTagTab={addTagTab} activeNav={activeNav} />
          </div>
          <div className="w-8/12">
            <Posts {...bookDetails} books={getBook()}

            /></div>
        </div>

      </div>
    </main>
  );

}