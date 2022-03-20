import React, { useState, useEffect} from 'react';
import { TAGS_URL } from '../utils/Constant';
import Loader from './Loading';

const Tags = (props) => {

const [tags, setTags] = useState(null)
const [error, setError] = useState(null)

  useEffect(() => {
    fetch(TAGS_URL)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        else return res.json();
      })
      .then((data) => setTags(data.tags.filter(tag=>tag) ))
      .catch((error) => {
        setError('Not able to fetch data!');
      });
  }, [])
  
  let { activeTag, addTagTab } = props;

    if (error) {
      return <p className="text-3xl text-center mt-4 text-red-500">{error}</p>;
    }

    if (!tags) return <Loader />;

    return (
      <aside className="border-bg-white-100 rounded p-2">
        <h3 className="mb-4 text-lg">Browse by Categorys</h3>
        <ul className="flex flex-wrap">
          {tags.map((tag) => (
            <li
              key={tag}
              className={`border rounded-lg text-sm mr-1 px-1 mb-2 text-white cursor-pointer ${
                activeTag === tag ? 'bg-primary' : 'bg-gray-400'
              }`}
              onClick={() => {
                addTagTab(tag);
              }}
            >
              {tag.length === 0 ? '' : tag}
            </li>
          ))}
        </ul>
      </aside>
    );
}

export default Tags;