import React, { useState } from 'react';
import { searchProduct } from '../api';
import { Product } from '../model';

interface SearchBarProps {
    setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Product[]>>;
  }

const SearchBar: React.FC<SearchBarProps> = ({ setShowSearchResults, setSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    const searchResults = await searchProduct(searchTerm);
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