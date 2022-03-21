import React, { useState, useEffect} from 'react';
import { withRouter } from 'react-router';
import { BOOKS_URL } from '../utils/Constant';
import Posts from './Posts';


const Profile = (props) => {

  const [activeTab, setActiveTab] = useState('author')
  const [books, setBooks] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchData(); 
  })

  const fetchData = ()=> {
    let { username } = props.match.params;

    fetch(`${BOOKS_URL}?${activeTab}=${username}`, {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject('Unable to fetch data for specific user!');
        }
        return res.json();
      })
      .then((data) => setBooks( data.books ))
      .catch((error) => setError( error ));
  }

  let { username } = props.match.params;
    
    return (
      <section>
        
        <div className="px-60">
          <Posts books={books} error={error} />
        </div>
      </section>
    );
}

export default withRouter(Profile);
