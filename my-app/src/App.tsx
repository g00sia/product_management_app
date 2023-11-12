import React, { useEffect, useState } from 'react';
import './App.css';
import InputField from '../../my-app2/src/components/InputField';
import { Todo } from './model';
import Todolist from './components/Todolist';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAdd =(e: React.FormEvent) => {
    e.preventDefault();
    if(todo){
      setTodos([...todos, {id:Date.now(), todo, isDone:false}])}
      setTodo("")
    
  };
  console.log(todos);


  useEffect(()=>{
    fetch('/dupa').then(res =>{
      return res.json()
  }).then(response =>console.log(response))
    }, [])
  

  return (
    <div className="App">
      <span className="heading">Thingyfy</span>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <Todolist todos={todos} setTodos={setTodos}/>
    </div>
  );
};

export default App;