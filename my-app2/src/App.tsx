import React, { useEffect, useState } from 'react';
import './App.css';
import InputField from './components/InputField';
import { Todo } from './model';
import Todolist from './components/Todolist';
import {addTodo} from './api';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);



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

  useEffect(() => {
    fetch('/getdata')
      .then((res) => res.json())
      .then((data) => {
        const todosData = data.map((item: any) => ({
          id: item.id,
          todo: item.content, 
        }));
        setTodos(todosData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
   



  return (
    <div className="App">
      <span className="heading">Thingyfy</span>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <Todolist todos={todos} setTodos={setTodos}/>
    </div>
  );
};

export default App;