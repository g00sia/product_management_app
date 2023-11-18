import React, { useEffect, useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import { Todo } from './model';
import Todolist from './components/Todolist';
import {addTodo, fetchData} from './api';
import Popup from './components/popup';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [buttonPopup, setButtonPopup] = useState(false);


 
  useEffect(() => {
    const fetchAndSetData = async () => {
      const data = await fetchData(); // Wywołanie funkcji fetchData
      setTodos(data);
    }; fetchAndSetData();
  }, []);


   
 const handleAdd = async (e: React.FormEvent) => {
  e.preventDefault();
  if (todo) {
    const newTodo = await addTodo(todo);
    if (newTodo) {
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setTodo("");
      window.location.reload();
    }
  }
};


  return (
    <div className="App">
      <span className="heading">Thingyfy</span>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <Todolist todos={todos} setTodos={setTodos} setButtonPopup={setButtonPopup}/>
{/* poczatek gowna  tyle dots ile stron (na stronę 5 produktow, czyli liczba produktow//5rr)*/}


<div className="pagination">
      <input id="dot-1" type="radio" name="dots" />
      <label htmlFor="dot-1"></label>

      <input id="dot-2" type="radio" name="dots" />
      <label htmlFor="dot-2"></label>

      <input id="dot-3" type="radio" name="dots" defaultChecked />
      <label htmlFor="dot-3"></label>

      <input id="dot-4" type="radio" name="dots" />
      <label htmlFor="dot-4"></label>

      <input id="dot-5" type="radio" name="dots" />
      <label htmlFor="dot-5"></label>

      <input id="dot-6" type="radio" name="dots" />
      <label htmlFor="dot-6"></label>

      <input id="dot-7" type="radio" name="dots" />
      <label htmlFor="dot-7"></label>

      <input id="dot-8" type="radio" name="dots" />
      <label htmlFor="dot-8"></label>

      <div className="pacman"></div>
    </div>

      {/* koniec gowna */}
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h3>nazwa produktu</h3>
        <br></br>
        <h3>komenaterze</h3>
        </Popup>

    </div>
  );
};

export default App;