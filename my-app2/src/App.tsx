import React, { useEffect, useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import { Todo } from './model';
import Todolist from './components/Todolist';
import {addTodo, fetchData, getTotalPages} from './api';
import Popup from './components/popup';
import SearchBar from './components/SearchBar'


const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [totalPages, setTotalPages] = useState(3);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Todo[]>([]);

 
  useEffect(() => {
    const fetchAndSetData = async (page: number, pageSize: number) => {
      const data = await fetchData(page, pageSize); 
      setTodos(data);
      const totalPages = await getTotalPages(pageSize);
      setTotalPages(totalPages)
    }; fetchAndSetData(page, pageSize);
  }, [page, pageSize]);


   
 const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  if (todo) {
    const newTodo = await addTodo(todo, description, imageUrl);
    if (newTodo) {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTodo("");
      setDescription("");
      setImageUrl("");
      window.location.reload();
    }
  }
};

const handlePageChange = (newPage: number) => {
  setPage(newPage);
};

const renderPaginationButtons = () => {
  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <input
        key={i}
        id={`dot-${i}`}
        type="radio"
        name="dots"
        checked={page === i}
        onChange={() => handlePageChange(i)}
      />
    );
  }
  return buttons;
};

  return (
    <div className="App">
      <span className="heading">Thingyfy</span>
      <InputField todo={todo}description={description}
        imageUrl={imageUrl}
        setTodo={setTodo}
        setDescription={setDescription}
        setImageUrl={setImageUrl}
        handleAdd={handleAdd} />
      <div className="pagination">{renderPaginationButtons()}</div>
      <Todolist todos={showSearchResults ? searchResults : todos} setTodos={setTodos} setButtonPopup={setButtonPopup}/>
      <SearchBar setShowSearchResults={setShowSearchResults} setSearchResults={setSearchResults}/>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h3>nazwa produktu</h3>
        <br></br>
        <h3>komenaterze</h3>
        </Popup>

    </div>
  );
};

export default App;