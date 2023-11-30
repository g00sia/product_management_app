import React, { useState } from 'react';
import { searchTodo } from '../api';
import { Todo } from '../model';

interface SearchBarProps {
    setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Todo[]>>;
  }

const SearchBar: React.FC<SearchBarProps> = ({ setShowSearchResults, setSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    const searchResults = await searchTodo(searchTerm);
    setSearchResults(searchResults);
    setShowSearchResults(true);
  };

  return (
    <div>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="searchbar"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;