import React from 'react'
import { Todo } from '../model';
import "./styles.css";


type Props ={
    todo:Todo;
    todos:Todo[];
    setTodos:React.Dispatch<React.SetStateAction<Todo[]>>;
};
const SingleTodo = ({todo, todos, setTodos}: Props) => {
  return (
    <form className='todos_single'>
      <span className = "todos_single--text">{todo.todo}</span>

      <div>
        <span className="icon">e</span>
        <span className="icon">u</span>
        <span className="icon">d</span>

      </div>
      </form>
  )
}

export default SingleTodo