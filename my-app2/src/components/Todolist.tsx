import React from 'react'
import "./styles.css"
import { Todo } from '../model';
import SingleTodo from './SingleTodo';

interface Props{
    todos:Todo[];
    setTodos:React.Dispatch<React.SetStateAction<Todo[]>>;
    setButtonPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Todolist: React.FC<Props> = ({todos, setTodos,setButtonPopup}: Props) => {
  return (
    <div className="todos">
        {todos.map(todo=>(
            <SingleTodo
            todo = {todo} 
            key={todo.id}
            todos = {todos}
            setTodos = {setTodos}
            setButtonPopup={setButtonPopup}/>
        ))}
    </div>
  )
};

export default Todolist