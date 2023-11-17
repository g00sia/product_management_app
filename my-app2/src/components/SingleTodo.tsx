import React , {useRef, useState, useEffect} from 'react'
import { Todo } from '../model';
import "./styles.css";
import { deleteTodo, editTodo } from '../api';


type Props ={
    todo:Todo;
    todos:Todo[];
    setTodos:React.Dispatch<React.SetStateAction<Todo[]>>;
};
const SingleTodo = ({todo, todos, setTodos}: Props) => {
  const [edit, setEdit] = useState<boolean>(false)
  const [editTodo, setEditTodo] = useState<string>(todo.todo)

  const handleDelete = async () => {
    const success = await deleteTodo(todo.id);
    if (success) {
      const updatedTodos = todos.filter((item) => item.id !== todo.id);
      setTodos(updatedTodos);
    }
  };


const handleEdit = (e:React.FormEvent, id: number)=>{
  e.preventDefault();

    setTodos(
      todos.map((todo)=>(todo.id===id ? {...todo, todo:editTodo}:todo))
    );
  setEdit(false);
};


const inputRef = useRef<HTMLInputElement>(null)

useEffect(()=>{
  inputRef.current?.focus();
}, [edit])

  

  return (
    <form className='todos_single' onSubmit = {(e)=>handleEdit(e, todo.id)}>
  { edit?(
          <input ref = {inputRef} value = {editTodo} onChange={(e) => setEditTodo(e.target.value)} className =  'todos_single--input'/>
      ): (
  

      <span className = "todos_single--text">{todo.todo}</span>)
      }
      <div>
        <span className="icon" onClick={()=>{if (!edit){setEdit(!edit)}}}>e</span>
        <span className="icon" onClick={handleDelete}>u</span>

      </div>
      </form>
  )
}

export default SingleTodo