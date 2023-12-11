import React, { useState } from 'react';
import { searchProduct } from '../api';
import { Product } from '../model';
import { GiCroissant } from "react-icons/gi";

interface SearchBarProps {
    setShowSearchResults: React.Dispatch<React.SetStateAction<boolean>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Product[]>>;
  }

const SearchBar: React.FC<SearchBarProps> = ({ setShowSearchResults, setSearchResults }) => {
    const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
    const searchResults = await searchProduct(searchTerm);
    setSearchResults(searchResults);
    setShowSearchResults(true);
  } else{
    setSearchResults([]);
    setShowSearchResults(false);
  }
  };


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress = {handleKeyPress}
        className="searchbar"
      />
      <button className = "searchbutton" onClick={handleSearch}> search <GiCroissant /></button>
    </div>
  );
};

export default SearchBar;